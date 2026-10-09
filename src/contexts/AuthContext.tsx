import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { store, DEMO_USERS } from '../services/store';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, role: UserRole, organizationName?: string) => Promise<boolean>;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<User>) => void;
  allDemoUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => store.getCurrentUser());

  useEffect(() => {
    // Sync with store on mount
    setUser(store.getCurrentUser());
  }, []);

  const login = async (email: string, targetRole?: UserRole): Promise<boolean> => {
    const users = store.getUsers();
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!found && targetRole) {
      found = users.find(u => u.role === targetRole);
    }

    if (!found) {
      // Fallback: create or pick matching demo user
      found = users[0];
    }

    store.setCurrentUser(found);
    setUser(found);

    store.addAuditEvent({
      actorId: found.id,
      actorName: found.name,
      actorRole: found.role,
      action: 'user_status_changed',
      targetResource: `Session: ${found.email}`,
      result: 'success',
      timestamp: new Date().toISOString(),
      metadata: { action: 'login', method: 'password_auth' }
    });

    return true;
  };

  const logout = () => {
    // Switch to individual default or reset session
    store.addAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'user_status_changed',
      targetResource: `Session: ${user.email}`,
      result: 'success',
      timestamp: new Date().toISOString(),
      metadata: { action: 'logout' }
    });
    // Set to first individual user
    const individual = DEMO_USERS[0];
    store.setCurrentUser(individual);
    setUser(individual);
  };

  const register = async (name: string, email: string, role: UserRole, organizationName?: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: role === 'admin' ? 'individual' : role, // Prevent self-elevating to admin as per prompt requirement!
      organizationName,
      title: role === 'issuer' ? 'Official Registrar' : 'Individual Verifier',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'New VeriDox platform member.',
      createdAt: new Date().toISOString(),
      verifiedStatus: role === 'individual' ? 'verified' : 'pending',
      documentCount: 0,
      preferences: {
        theme: 'light',
        emailAlerts: true,
        verificationNotifications: true,
        auditLogDigest: 'instant',
        twoFactorEnabled: false
      }
    };

    const users = store.getUsers();
    users.push(newUser);
    localStorage.setItem('veridox_users', JSON.stringify(users));
    store.setCurrentUser(newUser);
    setUser(newUser);

    store.addAuditEvent({
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: newUser.role,
      action: 'user_status_changed',
      targetResource: `Account: ${newUser.email}`,
      result: 'success',
      timestamp: new Date().toISOString(),
      metadata: { role: newUser.role, action: 'registration' }
    });

    return true;
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    store.setCurrentUser(targetUser);
    setUser(targetUser);
  };

  const updateProfile = (updates: Partial<User>) => {
    const updated = store.updateUser(user.id, updates);
    setUser({ ...updated });
    store.addAuditEvent({
      actorId: updated.id,
      actorName: updated.name,
      actorRole: updated.role,
      action: 'user_status_changed',
      targetResource: `User Profile: ${updated.id}`,
      result: 'success',
      timestamp: new Date().toISOString(),
      metadata: { updatedFields: Object.keys(updates).join(', ') }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        login,
        logout,
        register,
        switchRole,
        updateProfile,
        allDemoUsers: DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

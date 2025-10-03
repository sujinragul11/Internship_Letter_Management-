import React, { useState, useEffect } from 'react';
import { Users, Clock, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function UserActivity() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (user) {
      setUserInfo({
        email: user.email,
        id: user.id,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        emailConfirmed: user.email_confirmed_at,
        provider: user.app_metadata?.provider || 'email',
      });
    }
  }, [user]);

  if (!userInfo) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Activity</h2>
          <p className="text-gray-600 mt-1">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Activity</h2>
        <p className="text-gray-600 mt-1">
          View your account information and activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-sm text-gray-900 mt-1">{userInfo.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-xs text-gray-600 mt-1 font-mono">{userInfo.id}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Authentication Provider</p>
                  <p className="text-sm text-gray-900 mt-1 capitalize">{userInfo.provider}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Created</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {userInfo.createdAt
                      ? new Date(userInfo.createdAt).toLocaleString('en-US', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Sign In</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {userInfo.lastSignIn
                      ? new Date(userInfo.lastSignIn).toLocaleString('en-US', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {userInfo.emailConfirmed && (
              <div className="flex items-start justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Confirmed</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(userInfo.emailConfirmed).toLocaleString('en-US', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">Security Notice</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your account is secured with email and password authentication. Keep your password safe and never share it with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserActivity;

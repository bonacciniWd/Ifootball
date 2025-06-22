import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AuthDebugger = () => {
  const { user, isAuthenticated, loading, session } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-black/90 text-white border-red-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-red-400">🐛 Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Loading:</strong> {loading ? '⏳ Yes' : '✅ No'}
        </div>
        <div>
          <strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>User Email:</strong> {user?.email || '❌ None'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || '❌ None'}
        </div>
        <div>
          <strong>Session:</strong> {session ? '✅ Active' : '❌ None'}
        </div>
        <div>
          <strong>Raw User:</strong> 
          <pre className="text-xs bg-gray-800 p-2 mt-1 rounded overflow-auto max-h-20">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        <Button 
          size="sm" 
          onClick={() => {
            console.log('Full Auth State:', { user, isAuthenticated, loading, session });
          }}
          className="w-full mt-2"
        >
          Log to Console
        </Button>
      </CardContent>
    </Card>
  );
};

import { useState, useEffect, useCallback } from 'react';
import { ChatDots, Cpu, JournalCode, Hdd } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';

const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addWorkspace = useCallback(async (name) => {
    if (name) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/workspaces', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({ name }),
        });
        const data = await res.json();
        const newWorkspace = {
            ...data,
            id: data._id,
            children: [
              { id: `${data._id}-chat`, name: 'AI Chat', icon: <ChatDots className="me-2" /> },
              { id: `${data._id}-mem`, name: 'AI Memory', icon: <Cpu className="me-2" /> },
              { id: `${data._id}-ide`, name: 'FreeForm whiteboard', icon: <JournalCode className="me-2" /> },
              { id: `${data._id}-store`, name: 'Storage', icon: <Hdd className="me-2" /> },
            ]
        };
        setWorkspaces(prev => [...prev, newWorkspace]);
      } catch (err) {
        console.error('Error adding workspace:', err);
      }
    }
  }, []);

  const getWorkspaces = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/workspaces', {
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await res.json();
      const workspacesWithChildren = data.map(ws => ({
        ...ws,
        id: ws._id, // Remap _id to id for client-side consistency
        children: [
          { id: `${ws._id}-chat`, name: 'AI Chat', icon: <ChatDots className="me-2" /> },
          { id: `${ws._id}-mem`, name: 'AI Memory', icon: <Cpu className="me-2" /> },
          { id: `${ws._id}-ide`, name: 'FreeForm whiteboard', icon: <JournalCode className="me-2" /> },
          { id: `${ws._id}-store`, name: 'Storage', icon: <Hdd className="me-2" /> },
        ]
      }));
      setWorkspaces(workspacesWithChildren);
      return workspacesWithChildren;
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAndCreate = async () => {
      if (user) {
        const fetchedWorkspaces = await getWorkspaces();
        if (fetchedWorkspaces && fetchedWorkspaces.length === 0) {
          addWorkspace('Your workspace');
        }
      }
    }
    fetchAndCreate();
  }, [user, getWorkspaces, addWorkspace]);

  const editWorkspace = async (workspaceId, newName) => {
    if (newName) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/workspaces/${workspaceId}` , {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({ name: newName }),
        });
        const data = await res.json();
        setWorkspaces(workspaces.map(ws => 
          ws.id === workspaceId ? { ...ws, name: data.name } : ws
        ));
      } catch (err) {
        console.error('Error editing workspace:', err);
      }
    }
  };

  const deleteWorkspace = async (workspaceId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
      setWorkspaces(workspaces.filter(ws => ws.id !== workspaceId));
    } catch (err) {
      console.error('Error deleting workspace:', err);
    }
  };

  const updateWorkspaceMemories = async (workspaceId, memories) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ memories }),
      });
      const data = await res.json();
      setWorkspaces(workspaces.map(ws =>
        ws.id === workspaceId ? { ...ws, memories: data.memories } : ws
      ));
    } catch (err) {
      console.error('Error updating workspace memories:', err);
    }
  };

  return { workspaces, addWorkspace, editWorkspace, deleteWorkspace, updateWorkspaceMemories };
};

export default useWorkspaces;

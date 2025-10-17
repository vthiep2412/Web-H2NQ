import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatDots, Cpu, JournalCode, Hdd } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

// Basic deep comparison utility for arrays of objects
const deepEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || typeof a != "object" ||
      b == null || typeof b != "object") return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    const objA = a[i];
    const objB = b[i];

    if (objA === objB) continue;
    if (objA == null || typeof objA != "object" ||
        objB == null || typeof objB != "object") return false;

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key) || objA[key] !== objB[key]) {
        return false;
      }
    }
  }
  return true;
};

const useWorkspaces = () => {
  const { t } = useTranslation();
  const [workspaces, setWorkspaces] = useState([]);
  const loadingRef = useRef(false); // Use useRef for loading state
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
              { id: `${data._id}-chat`, name: t('aiChat'), icon: <ChatDots className="me-2" /> },
              { id: `${data._id}-mem`, name: t('aiMemory'), icon: <Cpu className="me-2" /> },
              { id: `${data._id}-ide`, name: t('freeformWhiteboard'), icon: <JournalCode className="me-2" /> },
              { id: `${data._id}-store`, name: t('storage'), icon: <Hdd className="me-2" /> },
            ]
        };
        setWorkspaces(prev => {
          const newWorkspaces = [...prev, newWorkspace];
          if (!deepEqual(prev, newWorkspaces)) {
            return newWorkspaces;
          }
          return prev;
        });
      } catch (err) {
        console.error('Error adding workspace:', err);
      }
    }
  }, [t]);

  const getWorkspaces = useCallback(async () => {
    if (loadingRef.current) return; // Read from ref
    loadingRef.current = true; // Update ref
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
          { id: `${ws._id}-chat`, name: t('aiChat'), icon: <ChatDots className="me-2" /> },
          { id: `${ws._id}-mem`, name: t('aiMemory'), icon: <Cpu className="me-2" /> },
          { id: `${ws._id}-ide`, name: t('freeformWhiteboard'), icon: <JournalCode className="me-2" /> },
          { id: `${ws._id}-store`, name: t('storage'), icon: <Hdd className="me-2" /> },
        ]
      }));
      setWorkspaces(prev => {
        if (!deepEqual(prev, workspacesWithChildren)) {
          return workspacesWithChildren;
        }
        return prev;
      });
      return workspacesWithChildren;
    } catch (err) {
      console.error('Error fetching workspaces:', err);
      return [];
    } finally {
      loadingRef.current = false; // Update ref
    }
  }, [t]); // Empty dependency array for stability

  useEffect(() => {
    const fetchAndCreate = async () => {
      if (user) {
        const fetchedWorkspaces = await getWorkspaces();
        if (fetchedWorkspaces && fetchedWorkspaces.length === 0) {
          addWorkspace('Your Workspace');
        }
      }
    }
    fetchAndCreate();
  }, [user, getWorkspaces, addWorkspace, t]);

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
        setWorkspaces(prev => {
          const newWorkspaces = prev.map(ws => 
            ws.id === workspaceId ? { ...ws, name: data.name } : ws
          );
          if (!deepEqual(prev, newWorkspaces)) {
            return newWorkspaces;
          }
          return prev;
        });
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
      setWorkspaces(prev => {
        const newWorkspaces = prev.filter(ws => ws.id !== workspaceId);
        if (!deepEqual(prev, newWorkspaces)) {
          return newWorkspaces;
        }
        return prev;
      });
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
      setWorkspaces(prev => {
        const newWorkspaces = prev.map(ws =>
          ws.id === workspaceId ? { ...ws, memories: data.memories } : ws
        );
        if (!deepEqual(prev, newWorkspaces)) {
          return newWorkspaces;
        }
        return prev;
      });
    } catch (err) {
      console.error('Error updating workspace memories:', err);
    }
  };

  return { workspaces, addWorkspace, editWorkspace, deleteWorkspace, updateWorkspaceMemories };
};

export default useWorkspaces;

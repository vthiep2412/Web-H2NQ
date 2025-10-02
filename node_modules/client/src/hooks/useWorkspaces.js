import { useState } from 'react';
import { ChatDots, Cpu, JournalCode, Hdd } from 'react-bootstrap-icons';

const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([
    {
      id: 'ws1',
      name: 'Basic Workspace',
      children: [
        { id: 'chat1', name: 'AI Chat', icon: <ChatDots className="me-2" /> },
        { id: 'mem1', name: 'AI Memory', icon: <Cpu className="me-2" /> },
        { id: 'ide1', name: 'IDE', icon: <JournalCode className="me-2" /> },
        { id: 'store1', name: 'Storage', icon: <Hdd className="me-2" /> },
      ]
    }
  ]);

  const addWorkspace = (name) => {
    if (name) {
      const newWorkspace = {
        id: `ws${workspaces.length + 1}`,
        name,
        children: [
          { id: `chat${workspaces.length + 1}`, name: 'AI Chat', icon: <ChatDots className="me-2" /> },
          { id: `mem${workspaces.length + 1}`, name: 'AI Memory', icon: <Cpu className="me-2" /> },
          { id: `ide${workspaces.length + 1}`, name: 'IDE', icon: <JournalCode className="me-2" /> },
          { id: `store${workspaces.length + 1}`, name: 'Storage', icon: <Hdd className="me-2" /> },
        ]
      };
      setWorkspaces([...workspaces, newWorkspace]);
    }
  };

  const editWorkspace = (workspaceId, newName) => {
    if (newName) {
      setWorkspaces(workspaces.map(ws => 
        ws.id === workspaceId ? { ...ws, name: newName } : ws
      ));
    }
  };

  const deleteWorkspace = (workspaceId) => {
    setWorkspaces(workspaces.filter(ws => ws.id !== workspaceId));
  };

  return { workspaces, addWorkspace, editWorkspace, deleteWorkspace };
};

export default useWorkspaces;

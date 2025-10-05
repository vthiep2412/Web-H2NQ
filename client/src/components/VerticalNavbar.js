import React, { useState, useEffect } from 'react';
import { Nav, Collapse, Button, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { 
  ChevronDown, 
  ChevronRight, 
  Gear,
  Pencil,
  PlusLg,
  Check,
  X,
  Trash,
  ClockHistory
} from 'react-bootstrap-icons';

const VerticalNavbar = React.memo(({ 
  activeView, 
  onViewChange, 
  workspaces, 
  addWorkspace, 
  editWorkspace,
  deleteWorkspace,
  toggleHistoryNavbar,
  isHistoryNavbarVisible,
  toggleNavbar // Added toggleNavbar prop
}) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        toggleNavbar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [toggleNavbar]);
  const [open, setOpen] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (workspaces.length > 0 && Object.keys(open).length === 0) {
      setOpen(prevOpen => ({ ...prevOpen, [workspaces[0].id]: true }));
    }
  }, [workspaces]);

  const toggleWorkspace = (id) => {
    setOpen(prevOpen => ({ ...prevOpen, [id]: !prevOpen[id] }));
  };

  const handleAddWorkspace = () => {
    if (newWorkspaceName.trim()) {
      addWorkspace(newWorkspaceName);
      setNewWorkspaceName('');
      setIsAdding(false);
    }
  };

  const handleEditWorkspace = (id) => {
    if (editingName.trim()) {
      editWorkspace(id, editingName);
      setEditingWorkspaceId(null);
      setEditingName('');
    }
  };

  const startEditing = (ws) => {
    setEditingWorkspaceId(ws.id);
    setEditingName(ws.name);
  };

  const cancelEditing = () => {
    setEditingWorkspaceId(null);
    setEditingName('');
  };

  const handleDelete = (workspaceId) => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      deleteWorkspace(workspaceId);
    }
  };

  return (
    <nav className="vertical-navbar">
      <div className="navbar-brand-container d-flex justify-content-between align-items-center mb-2">
        <h4 className="navbar-brand">Workspaces</h4>
        <Button variant="link" onClick={() => setIsAdding(!isAdding)} className="p-0 text-dark mb-2 theme-aware-button">
          <PlusLg size={20} />
        </Button>
      </div>

      {isAdding && (
        <InputGroup className="mb-2">
          <Form.Control
            placeholder="New workspace name"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAddWorkspace()}
          />
          <Button variant="outline-secondary" onClick={handleAddWorkspace} className="theme-aware-button">Add</Button>
        </InputGroup>
      )}

      <Nav className="flex-column">
        {workspaces.map(ws => (
          <div key={ws.id}>
            <div className="d-flex align-items-center">
              {editingWorkspaceId === ws.id ? (
                <InputGroup className="mb-2 flex-grow-1">
                  <Form.Control
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleEditWorkspace(ws.id)}
                    autoFocus
                  />
                  <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
                    <Button variant="link" onClick={() => handleEditWorkspace(ws.id)} className="p-1 text-dark mb-2 theme-aware-button"><Check size={20} /></Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Cancel</Tooltip>}>
                    <Button variant="link" onClick={cancelEditing} className="p-1 text-dark mb-2 theme-aware-button"><X size={20} /></Button>
                  </OverlayTrigger>
                </InputGroup>
              ) : (
                <>
                  <Nav.Link 
                    onClick={() => {
                      toggleWorkspace(ws.id);
                      onViewChange(ws.children[0]?.id || ws.id);
                      if (window.innerWidth < 576) {
                        toggleNavbar(false);
                      }
                    }} 
                    aria-expanded={open[ws.id]} 
                    className="workspace-toggle flex-grow-1"
                  >
                    {open[ws.id] ? <ChevronDown className="me-2" /> : <ChevronRight className="me-2" />}
                    <strong>{ws.name}</strong>
                  </Nav.Link>
                  <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                    <Button variant="link" onClick={() => startEditing(ws)} className="p-1 text-dark mb-2 me-1 theme-aware-button">
                      <Pencil size={16} />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                    <Button variant="link" onClick={() => handleDelete(ws.id)} className="p-1 text-dark mb-2 theme-aware-button" disabled={workspaces.length <= 1}>
                      <Trash size={16} />
                    </Button>
                  </OverlayTrigger>
                </>
              )}
            </div>
            <Collapse in={open[ws.id] && editingWorkspaceId !== ws.id}>
              <div className="workspace-children">
                {ws.children.map(child => (
                  <Nav.Link 
                    key={child.id} 
                    active={activeView === child.id}
                    onClick={() => {
                      onViewChange(child.id);
                      if (window.innerWidth < 576) {
                        toggleNavbar(false);
                      }
                    }}
                  >
                    {child.icon}
                    {child.name}
                  </Nav.Link>
                ))}
                <Nav.Link 
                  onClick={() => {
                    toggleHistoryNavbar();
                    if (window.innerWidth < 576) {
                      toggleNavbar(false);
                    }
                  }}
                  active={isHistoryNavbarVisible}
                >
                  <ClockHistory className="me-2" /> History
                </Nav.Link>
              </div>
            </Collapse>
          </div>
        ))}
      </Nav>

      <div className="navbar-bottom">
        <Nav className="flex-column">
          <Nav.Link 
            active={activeView === 'settings'}
            onClick={() => onViewChange('settings')}
          >
            <Gear className="me-2" /> Settings
          </Nav.Link>
        </Nav>
      </div>
    </nav>
  );
});

export default VerticalNavbar;

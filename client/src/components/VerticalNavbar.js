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
import { useTranslation } from 'react-i18next';

const VerticalNavbar = React.memo(({
  activeView,
  onViewChange,
  workspaces,
  addWorkspace,
  editWorkspace,
  deleteWorkspace,
  toggleHistoryNavbar,
  isHistoryNavbarVisible,
  getWorkspaces
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    getWorkspaces();
  }, [getWorkspaces]);


  const [open, setOpen] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (activeView && workspaces.length > 0) {
      const activeWorkspace = workspaces.find(ws => ws.children.some(child => child.id === activeView));
      if (activeWorkspace) {
        setOpen(prevOpen => ({ ...prevOpen, [activeWorkspace.id]: true }));
      }
    }
  }, [activeView, workspaces]);

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
    if (window.confirm(t('deleteWorkspaceConfirmation'))) {
      deleteWorkspace(workspaceId);
    }
  };

  return (
    <nav className="vertical-navbar">
      <div className="navbar-brand-container d-flex justify-content-between align-items-center mb-2">
        <h4 className="navbar-brand">{t('workspaces')}</h4>
        <Button variant="link" onClick={() => setIsAdding(!isAdding)} className="p-0 text-dark mb-2 theme-aware-button">
          <PlusLg size={20} />
        </Button>
      </div>

      {isAdding && (
        <InputGroup className="mb-2">
          <Form.Control
            placeholder={t('newWorkspaceNamePlaceholder')}
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAddWorkspace()}
          />
          <Button variant="outline-secondary" onClick={handleAddWorkspace} className="theme-aware-button">{t('add')}</Button>
        </InputGroup>
      )}

      <Nav className="flex-column">
        {workspaces.map(ws => (
          <div key={ws.id}>
            <div className="d-flex align-items-center vert-nav-top">
              {editingWorkspaceId === ws.id ? (
                <InputGroup className="mb-2 flex-grow-1">
                  <Form.Control
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleEditWorkspace(ws.id)}
                    autoFocus
                  />
                  <OverlayTrigger overlay={<Tooltip>{t('save')}</Tooltip>}>
                    <Button variant="link" onClick={() => handleEditWorkspace(ws.id)} className="p-1 text-dark mb-2 theme-aware-button"><Check size={20} /></Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>{t('cancel')}</Tooltip>}>
                    <Button variant="link" onClick={cancelEditing} className="p-1 text-dark mb-2 theme-aware-button"><X size={20} /></Button>
                  </OverlayTrigger>
                </InputGroup>
              ) : (
                <>
                  <Nav.Link 
                    onClick={() => toggleWorkspace(ws.id)} 
                    aria-expanded={open[ws.id]} 
                    className="workspace-toggle flex-grow-1 flex items-center"
                  >
                    {open[ws.id] ? <ChevronDown className="mr-2" /> : <ChevronRight className="mr-2" />}
                    <strong>{ws.name}</strong>
                  </Nav.Link>
                  <OverlayTrigger overlay={<Tooltip>{t('edit')}</Tooltip>}>
                    <Button variant="link" onClick={() => startEditing(ws)} className="p-1 text-dark theme-aware-button">
                      <Pencil size={16} />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger overlay={<Tooltip>{t('delete')}</Tooltip>}>
                    <Button variant="link" onClick={() => handleDelete(ws.id)} className="p-1 text-dark theme-aware-button" disabled={workspaces.length <= 1}>
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
                      getWorkspaces();
                    }}
                    className="flex items-center"
                  >
                    {child.icon && <span className="mr-2">{child.icon}</span>}
                    {child.name}
                  </Nav.Link>
                ))}
                {/* <Nav.Link 
                  onClick={() => {
                    toggleHistoryNavbar();
                    if (window.innerWidth < 576) {
                      toggleNavbar(false);
                    }
                    getWorkspaces();
                  }}
                  active={isHistoryNavbarVisible}
                  className="flex items-center"
                >
                  <span className="mr-2 custom-history-nav"><ClockHistory /></span> {t('history')}
                </Nav.Link>               */}
              </div>
            </Collapse>
          </div>
        ))}
      </Nav>

      <div className="navbar-bottom">
        <Nav className="flex-column">
          <Nav.Link 
            onClick={() => {
              toggleHistoryNavbar();
              getWorkspaces();
            }}
            active={isHistoryNavbarVisible}
            className="flex items-center"
          >
            <span className="mr-2 custom-history-nav"><ClockHistory /></span> {t('history')}
          </Nav.Link>
          <Nav.Link 
            active={activeView === 'settings'}
            onClick={() => {
              onViewChange('settings');
              getWorkspaces();
            }}
            className="flex items-center"
          >
            <Gear className="mr-2" /> {t('settings')}
          </Nav.Link>
        </Nav>
      </div>
    </nav>
  );
});

export default VerticalNavbar;


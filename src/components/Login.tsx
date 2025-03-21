import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  max-width: 400px;
`;

const Title = styled.h2`
  color: #9C27B0;
  margin-bottom: 20px;
  font-size: 2rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 10px 0 20px;
  text-align: center;
  font-size: 1.1rem;
`;

const ProfilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  width: 100%;
  max-width: 300px;
`;

const ProfileWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    .delete-button {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

const ProfileButton = styled.button<{ isSelected: boolean }>`
  width: 100%;
  padding: 15px 25px;
  border: 2px solid ${props => props.isSelected ? '#9C27B0' : 'transparent'};
  border-radius: 12px;
  background: ${props => props.isSelected ? '#9C27B0' : '#f5f0f7'};
  color: ${props => props.isSelected ? 'white' : '#9C27B0'};
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(156, 39, 176, 0.15);
    background: ${props => props.isSelected ? '#9C27B0' : '#efe5f3'};
    border-color: #9C27B0;
  }

  &::after {
    content: '${props => props.isSelected ? '✓' : '→'}';
    font-size: ${props => props.isSelected ? '1.4rem' : '1.2rem'};
    opacity: ${props => props.isSelected ? '1' : '0.5'};
    margin-left: 10px;
  }
`;

const DeleteButton = styled.button`
  position: relative;
  background: #ff4081;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  padding: 0;
  line-height: 1;
  pointer-events: none;

  &:hover {
    background: #f50057;
    transform: scale(1.1);
  }
`;

const Input = styled.input`
  padding: 12px 20px;
  margin: 8px 0;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.1rem;
  width: 100%;
  max-width: 300px;

  &:focus {
    border-color: #9C27B0;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  background: #9C27B0;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;

  &:hover {
    background: #7B1FA2;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
    transform: none;
  }
`;

const AddProfileButton = styled(Button)`
  background: transparent;
  color: #9C27B0;
  border: 1px solid #9C27B0;
  font-size: 0.9rem;
  padding: 8px 16px;
  margin-top: 20px;
  opacity: 0.7;
  width: 100%;
  max-width: 300px;

  &:hover {
    background: rgba(156, 39, 176, 0.1);
    transform: translateY(-1px);
    opacity: 1;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const DialogTitle = styled.h3`
  color: #333;
  font-size: 1.3rem;
  margin: 0 0 16px;
`;

const DialogText = styled.p`
  color: #666;
  margin: 0 0 24px;
  font-size: 1.1rem;
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const DialogButton = styled.button<{ variant?: 'danger' | 'cancel' }>`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.variant === 'danger' ? '#ff4081' : '#f0f0f0'};
  color: ${props => props.variant === 'danger' ? 'white' : '#666'};

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.variant === 'danger' ? '#f50057' : '#e0e0e0'};
  }
`;

interface Profile {
  name: string;
  password: string;
}

interface LoginProps {
  onLogin: (playerName: string) => void;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  playerName: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, playerName }) => {
  if (!isOpen) return null;

  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogTitle>Delete Profile?</DialogTitle>
        <DialogText>
          Are you sure you want to remove {playerName}'s profile? This action cannot be undone.
        </DialogText>
        <DialogButtons>
          <DialogButton onClick={onClose}>
            Cancel
          </DialogButton>
          <DialogButton variant="danger" onClick={onConfirm}>
            Delete Profile
          </DialogButton>
        </DialogButtons>
      </DialogContent>
    </DialogOverlay>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; playerName: string }>({
    isOpen: false,
    playerName: ''
  });

  // Load profiles from localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem('memoryMatchProfiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  const handleProfileSelect = (name: string) => {
    setSelectedProfile(name);
    setPassword('');
    setError('');
  };

  const handleLogin = () => {
    const profile = profiles.find(p => p.name === selectedProfile);
    if (profile && profile.password === password) {
      onLogin(profile.name);
    } else {
      setError('Oops! Wrong password. Try again!');
    }
  };

  const handleAddProfile = () => {
    if (newName && newPassword) {
      const newProfiles = [...profiles, { name: newName, password: newPassword }];
      setProfiles(newProfiles);
      localStorage.setItem('memoryMatchProfiles', JSON.stringify(newProfiles));
      onLogin(newName);
    }
  };

  const handleDeleteProfile = (nameToDelete: string) => {
    const updatedProfiles = profiles.filter(p => p.name !== nameToDelete);
    setProfiles(updatedProfiles);
    localStorage.setItem('memoryMatchProfiles', JSON.stringify(updatedProfiles));
    
    if (selectedProfile === nameToDelete) {
      setSelectedProfile(null);
      setPassword('');
    }
  };

  const handleDeleteConfirm = () => {
    handleDeleteProfile(deleteDialog.playerName);
    setDeleteDialog({ isOpen: false, playerName: '' });
  };

  return (
    <LoginContainer>
      <Title>Welcome to Memory Match!</Title>
      {!showAddProfile ? (
        <>
          {profiles.length > 0 ? (
            <>
              <Subtitle>Choose your player:</Subtitle>
              <ProfilesContainer>
                {profiles.map(profile => (
                  <ProfileWrapper key={profile.name}>
                    <ProfileButton
                      isSelected={selectedProfile === profile.name}
                      onClick={() => handleProfileSelect(profile.name)}
                    >
                      <span>{profile.name}</span>
                    </ProfileButton>
                    <DeleteButton
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialog({ isOpen: true, playerName: profile.name });
                      }}
                      title="Delete profile"
                    >
                      ×
                    </DeleteButton>
                  </ProfileWrapper>
                ))}
              </ProfilesContainer>
            </>
          ) : (
            <Subtitle>Click below to create your first player profile!</Subtitle>
          )}

          {selectedProfile && (
            <>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <Button onClick={handleLogin} disabled={!password}>
                Start Playing!
              </Button>
            </>
          )}

          <AddProfileButton onClick={() => setShowAddProfile(true)}>
            + Add Family Member
          </AddProfileButton>
        </>
      ) : (
        <>
          <Subtitle>Create your player profile:</Subtitle>
          <Input
            type="text"
            placeholder="Enter your name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Choose a password (like your favorite color!)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handleAddProfile} disabled={!newName || !newPassword}>
            Create Profile
          </Button>
          <Button onClick={() => setShowAddProfile(false)} style={{ background: '#666' }}>
            Go Back
          </Button>
        </>
      )}
      
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, playerName: '' })}
        onConfirm={handleDeleteConfirm}
        playerName={deleteDialog.playerName}
      />
    </LoginContainer>
  );
};

export default Login; 
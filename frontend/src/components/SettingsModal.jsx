import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const SettingsModal = ({ show, onHide }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(userInfo?.theme || 'light');

  const [updateProfile, { isLoading }] = useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setTheme(userInfo?.theme || 'light');
  }, [userInfo]);

  const saveHandler = async () => {
    try {
      console.log('saveHandler: sending profile update with theme:', theme);
      const res = await updateProfile({
        name: userInfo.name,
        email: userInfo.email,
        theme,
      }).unwrap();
      console.log('saveHandler: success response:', res);

      // update local store with new theme
      dispatch(setCredentials({ ...res }));
      toast.success('Settings saved');
      // ensure theme saved to localStorage as well so ThemeHandler can fallback
      localStorage.setItem('theme', res.theme || theme || 'light');
      onHide();
    } catch (err) {
      console.error('saveHandler: error:', err);
      toast.error(err?.data?.message || err.error || 'Failed to save settings');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Theme</Form.Label>
            <div>
              <Form.Check
                inline
                label='Light'
                name='theme'
                type='radio'
                id='theme-light'
                checked={theme === 'light'}
                onChange={() => setTheme('light')}
              />
              <Form.Check
                inline
                label='Dark'
                name='theme'
                type='radio'
                id='theme-dark'
                checked={theme === 'dark'}
                onChange={() => setTheme('dark')}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancel
        </Button>
        <Button variant='primary' onClick={saveHandler} disabled={isLoading}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;

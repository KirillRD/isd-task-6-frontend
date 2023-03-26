import { Menubar } from 'primereact/menubar';
import { Chip } from 'primereact/chip';
import { useUserContext } from '../context/UserContext';

export const Navbar = () => {
  const { user, logout } = useUserContext();

  const handleLogoutClick = () => {
    logout();
  }

  return (
    <div className='flex justify-content-center bg-primary-200'>
      <Menubar className='bg-primary-200 col-9 border-none' end={
        <ul className='p-menubar-root-list' role='menubar'>
          <li role='none' className='p-menuitem ml-auto'>
            <Chip label={user!.name} icon='pi pi-user' />
          </li>
          <li role='none' className='p-menuitem ml-3'>
            <a href='#' role='menuitem' className='p-menuitem-link' aria-haspopup='false' onClick={handleLogoutClick}>
              <span className='p-menuitem-icon pi pi-sign-out'></span>
              <span className='p-menuitem-text'>Log out</span>
            </a>
          </li>
        </ul>
      } />
    </div>
  );
}

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
      <Menubar className='bg-primary-200 xl:col-9 lg:col-10 md:col-11 sm:col-12 border-none' end={
        <ul className='p-menubar-root-list'>
          <li className='p-menuitem'>
            <Chip label={user!.name} icon='pi pi-user' />
          </li>
          <li className='p-menuitem ml-3'>
            <a href='#' className='p-menuitem-link' onClick={handleLogoutClick}>
              <span className='p-menuitem-icon pi pi-sign-out'></span>
              <span className='p-menuitem-text'>Log out</span>
            </a>
          </li>
        </ul>
      } />
    </div>
  );
}

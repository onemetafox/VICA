/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CgProfile, CgCheck, CgClose, CgSoftwareUpload } from 'react-icons/cg';
import Container from 'src/components/Account/Container';
import EditProfileModal from 'src/components/Account/Modals/EditProfile';
import EditAvatar from 'src/components/Account/Modals/EditAvatar';
import ChangePasswordModal from 'src/components/Account/Modals/ChangePassword';

const Profile = ({ user }: any) => {
  const router = useRouter();

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openChangePassword, setChangePassword] = useState(false);
  const [openEditAvatar, setEditAvatar] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, []);

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-5">Profile</h1>
      <div className="w-full bg-white rounded-lg p-10 sm:px-3 sm:text-sm">
        <div className="flex items-center">
          <div
            className="text-8xl text-darkGray mr-5 sm:text-6xl sm:mr-3"
            onMouseOver={() => setOpen(true)}
            onMouseOut={() => setOpen(false)}
            onClick={() => setEditAvatar(true)}
          >
            {user?.photo ? (
              !open ? (
                <img
                  className="w-30 h-20 rounded-full"
                  src={open ? user?.photo : user?.photo}
                />
              ) : (
                <CgSoftwareUpload className="text-8xl text-darkGray mr-5 sm:text-6xl sm:mr-3" />
              )
            ) : !open ? (
              <CgProfile className="text-8xl text-darkGray mr-5 sm:text-6xl sm:mr-3" />
            ) : (
              <CgSoftwareUpload className="text-8xl text-darkGray mr-5 sm:text-6xl sm:mr-3" />
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold mb-3">
              {user?.first_name} {user?.last_name}
            </h2>
            <p>
              <span className="text-darkGray">Email: </span>
              {user?.email}
            </p>
            <p className="flex justify-between">
              <span className="text-darkGray mt-1">Verified Email</span>
              {user?.is_email_verified ? (
                <CgCheck className="text-4xl text-green-400 mr-5 sm:text-2xl sm:mr-3" />
              ) : (
                <CgClose className="text-2xl text-rose-700 mr-5 mt-1 sm:text-2xl sm:mr-3" />
              )}
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mt-16 mb-5">Profile settings</h1>
      <div className="w-full bg-white rounded-lg p-10 flex flex-col text-sm sm:px-3">
        <div className="w-full flex justify-between items-center sm:flex-col sm:items-stretch">
          <div className="flex flex-col xl:w-1/2 asm:w-full">
            <h3 className="font-bold mb-3">Basic information</h3>
            <p className="text-darkGray sm:mb-3">
              This is your basic profile information: Name, phone number,
              country and city.{' '}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg w-48 sm:w-full py-4 text-blue-600 bg-mediumGray hover:text-white hover:bg-blue-600"
            onClick={() => setOpenEditProfile(true)}
          >
            Edit profile
          </button>
        </div>
        <div className="w-full flex justify-between items-center mt-10 sm:flex-col sm:items-stretch">
          <div className="flex flex-col xl:w-1/2 asm:w-full">
            <h3 className="font-bold mb-3">Password</h3>
            <p className="text-darkGray sm:mb-3">
              You can always change your password.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg w-48 sm:w-full py-4 text-blue-600 bg-mediumGray hover:text-white hover:bg-blue-600"
            onClick={() => setChangePassword(true)}
          >
            Change password
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={openEditProfile}
        close={() => setOpenEditProfile(false)}
      />
      <ChangePasswordModal
        isOpen={openChangePassword}
        close={() => setChangePassword(false)}
      />
      {/* <EditAvatar isOpen={openEditAvatar} close={() => setEditAvatar(false)} /> */}
    </Container>
  );
};

export default Profile;

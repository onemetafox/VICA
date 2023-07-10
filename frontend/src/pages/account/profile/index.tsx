import Spinner from 'src/components/Spinner';
import { useFetchUser } from 'src/queries/user';
import Profile from 'src/components/Account/Profile';

const ProfilePage = () => {
  const { isLoading, data } = useFetchUser();

  if (isLoading) {
    return (
      <h1 className="w-screen h-screen my-auto mx-auto text-5xl">
        <Spinner /> Loading...
      </h1>
    );
  }
  return <Profile user={data} />;
};

export default ProfilePage;

import Spinner from 'src/components/Spinner';
import { useFetchMyOffers } from 'src/queries/offers';
import Offers from 'src/components/Account/Offers';

const ProfilePage = () => {
  const { isLoading, data } = useFetchMyOffers();

  if (isLoading) {
    return (
      <h1 className="w-screen h-screen my-auto mx-auto text-5xl">
        <Spinner /> Loading...
      </h1>
    );
  }

  return <Offers offers={data} />;
};

export default ProfilePage;

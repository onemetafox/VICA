import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useFetchUser, useUpdateImage } from 'src/queries/user';
import Avatar from 'react-avatar-edit';
import toast from 'react-hot-toast';
import EditProfile from './EditProfile';

type Props = {
  isOpen: boolean;
  close:
    | ((
        event?:
          | KeyboardEvent
          | TouchEvent
          | MouseEvent
          | React.SyntheticEvent<Element, Event>
          | undefined
      ) => void)
    | undefined;
};

interface Values {
  photo: string;
}

const EditAvatar = ({ isOpen, close }: Props) => {
  const [onCropp, setOnCropp] = useState('');
  const { mutate: UpdateImage } = useUpdateImage();

  const handleUpload = (elem) => {
    if (elem.target.files[0].size > 21680000) {
      toast.error('Image is Too big , Upload maximum 2 Mo !');
      elem.target.value = '';
    }
  };

  const onCrop = (preview) => {
    setOnCropp(preview);
  };

  const putImageHandler = () => {
    const formdata = new FormData();
    formdata.append('photo', dataURLtoFile(onCropp, 'profileImage.png'));
    UpdateImage({ photo: formdata });
    // console.log(dataURLtoFile(onCropp, 'profileImage.png'));
    // console.log(imagee[0]);

    if (close) close();
  };

  // const imagee = ({ data }) => <img src={onCropp} />;

  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  return (
    <Popup position="right center" open={isOpen} onClose={close}>
      <div className="flex flex-col justify-center items-center font-poppins w-full">
        <button type="button" onClick={close} className="self-end">
          <RiCloseCircleLine className="text-darkGray hover:text-darkBlack text-2xl" />
        </button>
        <Avatar
          width={390}
          height={295}
          onBeforeFileLoad={handleUpload}
          onCrop={onCrop}
        />
        <img className="w-30 h-30 " src={onCropp} />
      </div>

      <button
        type="button"
        className="ml-1 sm:ml-0 text-sm rounded-lg w-28 sm:w-full py-3 text-blue-600 bg-mediumGray hover:text-white hover:bg-blue-600"
        onClick={putImageHandler}
      >
        Corp & save
      </button>
    </Popup>
  );
};

export default EditAvatar;

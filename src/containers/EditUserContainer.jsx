import EditClientViewContainer from './EditClientViewContainer';
import EditUserViewContainer from './EditUserViewContainer';

function EditUserContainer(props) {
  const { view, user, closeModal } = props;
  // console.log(props);
  // console.log(user.seller?.id);
  return (
    <>
      {view == 'client' ? (
        <EditClientViewContainer
          close={closeModal}
          clientId={user.client?.id}
        />
      ) : null}
      {view == 'seller' ? (
        <EditUserViewContainer sellerId={user.seller?.id} close={closeModal} />
      ) : null}
    </>
  );
}

export default EditUserContainer;

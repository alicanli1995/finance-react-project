import React, {useContext, useEffect, useState} from 'react'
import {useKeycloak } from '@react-keycloak/web'
import {Container, Grid, Header, Segment, Divider, Form, Button} from 'semantic-ui-react'
import {getAvatarUrl, handleLogError} from '../misc/Helpers'
import {bistApi} from '../misc/BistApi'
import ConfirmationModal from '../misc/ConfirmationModal'
import SharesTable from "./SharesTable";
import ShareForm from "./ShareForm";
import {toast, ToastContainer} from "react-toastify";
import {FcEditImage, FcSettings, FcStatistics} from "react-icons/all";
import {DataContext} from "../misc/Balance";


function UserInformation(){

  let [name , setName] = useState('')
  let [amount , setAmount] = useState('')
  let [totalAmount , setTotalAmount] = useState('')
  let [bists , setBists] = useState([])
  let [bist, setBist] = useState(null)
  const { keycloak } = useKeycloak();
  let [modal, setModal] = useState({
    isOpen: false,
    header: '',
    content: '',
    onAction: null,
    onClose: null
  });
  let [firstAvatar, setFirstAvatar] = useState('')


    const {setBalance} = useContext(DataContext)

  let [bodyState, setBodyState] = useState("bistBody");


  let [username, setUsername] = useState('');
  let [avatar, setAvatar] = useState('');
  let [originalAvatar, setOriginalAvatar] = useState('');
  let [imageLoading, setImageLoading] = useState(false);




  useEffect(async () => {
      handleGetShares().then()
      try {
          const response = await bistApi.getUserExtrasMe(keycloak.token)
          console.log(response)
          setUsername(response.data.username)
          setAvatar(response.data.avatar)
          setOriginalAvatar(response.data.avatar)
          setFirstAvatar(response.data.avatar)
      } catch (error) {
          handleLogError(error)
      }

  }, [])

 const handleChange = (e) => {
    const { value } = e.target;
    const newBist = {
        ...bist,
        amount: value,
        totalAmount: value * bist.price
    }
    setAmount(value);
    setBist(newBist);
  }

    const handleSuffle = () => {
        setImageLoading(true)
        const avatar = username + Math.floor(Math.random() * 1000) + 1
        setAvatar(avatar)
    }

    async function handleRollback() {
        try {
            const userExtra = { avatar: firstAvatar }
            await bistApi.saveUserExtrasMe(keycloak.token, userExtra)
            setAvatar(firstAvatar)
            setOriginalAvatar(firstAvatar)
            keycloak['avatar'] = firstAvatar
            getNotification('Avatar reverted to original')
        } catch (error) {
            handleLogError(error)
        }
    }

    const handleSave = async () => {
        try {
            const userExtra = { avatar }
            await bistApi.saveUserExtrasMe(keycloak.token, userExtra)
            keycloak['avatar'] = avatar
            getNotification('Avatar saved successfully')
        } catch (error) {
            handleLogError(error)
        }
    }

    const handleImageLoad = () => {
        setImageLoading(false)
    }


    const handleGetShares = async () => {
    try {
      const response = await bistApi.getUserShares(
        keycloak.token
      )
      setBists(response.data)
    } catch (error) {
      handleLogError(error)
    }
  }

  const handleEditShare =  async () => {
      const bist = {name, amount, totalAmount}
      try {
          await bistApi.saveShare(bist, keycloak.token).then(
              () => getNotification('Share saved successfully')
          )
              .then(() => handleGetShares())
              .then(() => clearForm())
              .finally(() => changeBalance())
      } catch (error) {
          handleLogError(error)
      }

  }

    const changeBalance = async () => {
        await bistApi.getBalanceOnUser(keycloak.token).then((response) => {
                console.log(response.data)
                setBalance(response.data);
            }
        ).catch((error) => {
            console.log(error);
        })
    }


  const getNotification = (message) => {
    return (
        toast.success(`${message} 💯🏆🙌`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
    );
  }


  const handleEditBist = (bist) => {
    setName(bist.name)
    setAmount(bist.amount)
    setTotalAmount(bist.totalAmount)
    setBist(bist)
  }

  const clearForm = () => {
    setBist(null)
  }


  async function handleDeleteAction(bist) {
      console.log(bist, 'bist')
      setModal({
          isOpen: true,
          header: 'Delete share',
          content: `Would you like to delete Share '${bist.name}'?`,
          onAction: (response) => {
              if (response) {
                  handleDeleteActionBist(bist).then(r => {
                      setModal({
                          isOpen: false,
                          header: '',
                          content: '',
                          onAction: null,
                          onClose: null
                      })
                  })
              .finally(() => changeBalance())
              }
              setModal({isOpen: false})
          },
          onClose: handleCloseModal
      });

  }

  const handleDeleteActionBist = async (bist) => {
        console.log(bist, 'deleteBist')
          try {
              await bistApi.deleteShareOnUser(bist.name, keycloak.token)
              getNotification('Share deleted successfully')
              await handleGetShares()
          } catch (error) {
              handleLogError(error)
          }
    }



    let handleCloseModal = () => {
        return {
            isOpen: false,
            header: '',
            content: '',
            onAction: null,
            onClose: null
        }
    }

    let bistBody = "";

    if (bodyState === "settingsBody") {
        const avatarImage = !avatar ? <></> : <img src={getAvatarUrl(avatar)} onLoad={handleImageLoad} alt='user-avatar' />
        bistBody =
        <Container>
            <Grid centered>
                <Grid.Row>
                    <Segment style={{ width: '330px' }}>
                        <Form>
                            <strong>Avatar</strong>
                            <div style={{ height: 300 }}>
                                {avatarImage}
                            </div>
                            <Divider />
                            <Button fluid onClick={handleSuffle} color='blue' disabled={imageLoading}>Shuffle</Button>
                            <Divider />
                            <Button.Group fluid>
                                <Button onClick={handleRollback}>Rollback</Button>
                                <Button.Or />
                                <Button disabled={originalAvatar === avatar} onClick={handleSave} positive>Save</Button>
                            </Button.Group>
                        </Form>
                    </Segment>
                </Grid.Row>
                <Grid.Row/>
                <Grid.Row/>
                <Grid.Row/>
                <Grid.Row/>
            </Grid>
        </Container>
    }

    if (bodyState === "bistBody") {
           bistBody =
               <div style={{
                     justifyContent: "center",
                     alignItems: "center",
               }}>
               <Grid centered>
               <Grid.Column computer={4}>
                    <Segment>
                        <Header  as='h2' >
                            <Header.Content> Share Information</Header.Content>
                        </Header>
                        <Divider />
                        <ShareForm
                            form={bist ? bist : ""}
                            handleChange={handleChange}
                            handleSaveBist={handleEditShare}
                            clearForm={clearForm} />
                    </Segment>
            </Grid.Column>
            <Grid.Column computer={12} >
                <SharesTable
                    bists={bists}
                    handleDeleteBist={handleDeleteAction}
                    handleEditBist={handleEditBist}
                />
            </Grid.Column>
           </Grid>
           </div>
    }



  return (
      <Container>
          <Grid>
        <Grid.Row>
          <div style={{  marginTop:50, marginLeft:440, marginRight: 50, marginBottom: 50, height: '100%' , width:278}}>
          <Grid.Column mobile={3} tablet={3} computer={3}>
            <div className="ui labeled icon menu" style={{marginLeft:-10, borderRadius: 10}}>
              <a className="item" onClick={() => setBodyState("bistBody")}>
                <FcEditImage size={30} />
                <br/>
                Edit Share
              </a>
              <a className="item">
                <FcStatistics size={30} />
                <br/>
                Statistics
              </a>
              <a className="item" onClick={() => setBodyState("settingsBody")}>
                <FcSettings size={30} />
                <br/>
                Settings
              </a>
            </div>
          </Grid.Column>
          </div>
        </Grid.Row>
        </Grid>
            {bistBody}
        <ToastContainer />
        <ConfirmationModal modal={modal} />
      </Container>
  )
}

export default UserInformation
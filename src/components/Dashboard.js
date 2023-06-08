import React, { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import SimpleBottomNavigation from "./Bottom"
import { auth } from '../firebase';
import BlockIcon from '@mui/icons-material/Block';
import { useAuthState } from 'react-firebase-hooks/auth';
import {generateDID, genKeyPair} from '../utilities';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';

import { green } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import NumbersIcon from '@mui/icons-material/Numbers';
// import DateRangeIcon from '@mui/icons-material/DateRange';
import GradingIcon from '@mui/icons-material/Grading';
import SchoolIcon from '@mui/icons-material/School';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { db } from '../firebase';
import img from "../image/aassad81aa.png"
import TextField from '@mui/material/TextField';
import { TextareaAutosize } from '@mui/base';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Dashboard() {
  
  const [user] = useAuthState(auth);
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()
  const [page, setPage] = useState(0)
  const [admin, setAdmin] = useState(false)
  const [file, setFile] = useState();
  const [state, setState] = React.useState({
    dob: true,
    licence_no: false,
    expiry: false,
  });

  const [state2, setState2] = React.useState({
    wam: true,
    faculty: false,
    units: false,
  });

  const [ selectedCredential, setSelectedCredential ] = useState(-1)

  // const [credential, setCredential] = React.useState({
  //   driversLicence: true,
  //   transcript: true,
  // })

  const [contactEmail, setContactEmail] = React.useState('')
  const [nickname, setNickname] = React.useState('')
  const [contacts, setContacts] = React.useState({})
  const [credentials, setCredentials] = React.useState({})

  const [open, setOpen] = React.useState(false);
  const [openContact, setOpenContact] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [selections, setSelections] = React.useState([]);
  const [disclosed, setDisclosed] = React.useState([true, true, true, true, true]);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [snack, setSnack] = React.useState(false);
  const [warn, setWarn] = React.useState(false);

  useEffect(() => {
    getCredentials();
    isAdmin();
    getContacts();
  }, [admin])

  const handleClickOpen = (index) => {
    setSelectedCredential(index)
    setOpen(true);
  };

  const handleClose = () => {
    if (selectedCredential !== -1) {
      const key = Object.keys(credentials)[selectedCredential]
      let ref = db.ref('/Credentials/' + key);
      ref.child('valid').set('false')
    }
    setOpen(false);
  };

  const handleCloseContact = () => {
    let ref = db.ref('/Contact');
    if (admin) {
      ref.child('users/' + nickname).set({email: contactEmail})
    }
    setOpenContact(false);
  };




  const handleChange2 = (event) => {
    setState2({
      ...state2,
      [event.target.name]: event.target.checked,
    });
  };

  const { wam, faculty, units } = state2;

  const getCredentials = () => {
    let ref = db.ref('/Credentials');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      setCredentials(state);
    });
  }

  const getContacts = () => {
    let ref = db.ref('/Roles/admin');
    if (admin) {
      ref = db.ref('/Contact/users');
    }
    ref.on('value', snapshot => {
      const state = snapshot.val();
      setContacts(state);
    })
  }

  const isAdmin = () => {
    let ref = db.ref('/Roles');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      const obj = Object.values(state?.admin || {});
      if (obj?.length > 0 && obj[0] === user.email) {
        setAdmin(true);
      }
    });
  }

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  const handleSelectiveDisclosure = (index) => {
    const obj = Object.values(credentials)[index]
    setSelections(Object.entries(obj))
    setPage(3)
  }


const setCredential = (credential_name, body) => {
  let ref = db.ref('/Credentials');
  ref.child(credential_name).set({...body, issuedBy: "UNSW", valid: "true"})
};
  let a = genKeyPair(admin)

  return (
    <>
    { page === 0 && <Box>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>DID:</strong> {generateDID(user.uid)}</p>
          <p><strong>private key:</strong> {a}</p>

          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </Box>
    }
    { page === 1 && 
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {credentials && Object.entries(credentials).map((entry, index) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
              <Avatar sx={{ bgcolor: green[500] }}>
                <AssignmentIcon onClick={() => handleSelectiveDisclosure(index)}/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={entry[0]}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Issued by: {entry[1].issuedBy}
                  </Typography>
                </React.Fragment>
              }
            />
            {admin && <BlockIcon onClick={() => handleClickOpen(index)}/>}
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
        ))}
      </List>
      {admin && 
      <div>
        <input type="file" onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0])
          }
        }}/>
        <div>{file && `${file.name} - ${file.type}`}</div>
        <Button
          variant="contained"
          component="label"
          disabled={!file}
          onClick={() => setSnack(true)}
        >
          Scan QR Code
        </Button>
      </div>
      }
      <Snackbar anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }} open={snack} autoHideDuration={6000} onClose={() => setSnack(false)}>
        <Alert onClose={() => setSnack(false)} severity="success">
          Verified!
        </Alert>
      </Snackbar>
    </>
    }
    {
      page === 2 && <Box>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Contacts</h2>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {contacts && Object.entries(contacts).map((entry, index) => (
                   <>
                   <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon onClick={() => setOpenAdd(true)} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={entry[0]}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {entry[1].email?.toString() || "unsw@edu.com"}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  </>
            ))}
          </List>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        {admin && <Button variant="link" onClick={() => setOpenContact(true)}>
          Add Contacts
        </Button>}
        <Dialog open={openContact} onClose={() => setOpenContact(true)}>
        <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new contact, please enter the email address here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="nickname"
            label="Nickname"
            type="text"
            fullWidth
            variant="standard"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContact(false)}>Cancel</Button>
          <Button onClick={() => handleCloseContact()}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAdd} onClose={() => setOpenAdd(true)}>
        <DialogTitle>Issue Credential to the user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please type in the credential in JSON format.
          </DialogContentText>
          <TextField label="key" value = {title} onChange={(e) => setTitle(e.target.value)}/>
          <TextareaAutosize value = {text} onChange={(e) => setText(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button onClick={() => {
            setCredential(title, JSON.parse(text.toString()))
            setOpenAdd(false)
          }}>Issue</Button>
        </DialogActions>
      </Dialog>
      </div>
    </Box>
    }
    {
      page === 3 && <Box>
         <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Selective Disclosure</FormLabel>
        <FormGroup>
          {selections.map((entry, index) => {
            if (entry[0] === "issuedBy" || entry[0] === "valid") {
              return <> </>;
            }
            return (
              <FormControlLabel
                control={
                  <Checkbox checked={disclosed[index]} onChange={()=>{
                    setDisclosed([...disclosed.slice(0, index), !disclosed[index], ...disclosed.slice(index+1)])
                  }} name={entry[0]} />
                }
                label={entry[0]}
              />
            )
          })}
        </FormGroup>
        <Button variant="contained" onClick={() => {
          if (selections.find((entry, index) => { return entry[0] === "valid" && selections[index][1] === "true"})) {
            setPage(5)
          } else {
            setWarn(true)
          }
        }}>Confirm</Button>
        <FormHelperText>Please choose the fields you want to disclose</FormHelperText>
      </FormControl>
      <Snackbar anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }} open={warn} autoHideDuration={6000} onClose={() => setWarn(false)}>
        <Alert onClose={() => setWarn(false)} severity="error">
          The credential has been revoked by the issuer
        </Alert>
      </Snackbar>
      </Box>
    }
    {
      page === 4 && <Box>
         <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Selective Disclosure</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={wam} onChange={handleChange2} name="wam" />
            }
            label="WAM"
          />
          <FormControlLabel
            control={
              <Checkbox checked={faculty} onChange={handleChange2} name="faculty" />
            }
            label="faculty"
          />
          <FormControlLabel
            control={
              <Checkbox checked={units} onChange={handleChange2} name="units" />
            }
            label="units"
          />
        </FormGroup>
        <Button variant="contained" onClick={() => setPage(6)}>Confirm</Button>
        <FormHelperText>Please choose the fields you want to disclose</FormHelperText>
      </FormControl>
      </Box>
    }
    {
      page === 5 &&
      <Box>
        {
          !admin && <div>
            Please present this QR code to the verifier
            <img style={{ width: 250, height: 250 }} src={img} alt="error generating qr code" />
          </div>
        }
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        
        {disclosed.map((value, index) => {
          if (value && selections[index][0] !== "issuedBy" && selections[index][0] !== "valid") {
            return (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon color="primary"/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={selections[index][0]} secondary={selections[index][1]} />
              </ListItem>
            )
          }
        })}
    </List>
    </Box>
    }
    {
      page === 6 &&
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      { wam && <ListItem>
        <ListItemAvatar>
          <Avatar>
            <GradingIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="WAM" secondary="82" />
      </ListItem>}
      {faculty && <ListItem>
        <ListItemAvatar>
          <Avatar>
            <SchoolIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Faculty" secondary="Engineering" />
      </ListItem>}
      {units && <ListItem>
        <ListItemAvatar>
          <Avatar>
            <LocalLibraryIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Units completed" secondary="128" />
      </ListItem>}
    </List>
    }
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Revoke credential?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you confirm the credential will be revoked.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    <SimpleBottomNavigation setPage ={setPage}/>
  </>
  )
}


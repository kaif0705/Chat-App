import {HStack, VStack, Box, Container, Button, Input } from "@chakra-ui/react"
import Message from './Components/Message'
import{useEffect, useState, useRef} from "react"
import {app} from './firebase';
import {signOut, onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth"
import {query, orderBy, onSnapshot, getFirestore, addDoc, collection, serverTimestamp} from "firebase/firestore"
const auth= getAuth(app)
const db= getFirestore(app)

const loginHandler= ()=>{
  const provider= new GoogleAuthProvider();
  signInWithPopup(auth, provider)
}

const logOutHandler= ()=> signOut(auth)



function App() {
  
  const [user, setUser]= useState(false)
  const [message, setMessage]= useState("") 
  const [messages, setMessages]= useState([])
  const divForScroll= useRef(null)

  const submitHandler= async (e)=>{
    e.preventDefault()

    try{
      await addDoc(collection(db, "Messages"),{
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp()
      })
      setMessage("")
      divForScroll.current.scrollIntoView({ behaviour: "smooth"})
    }catch(error){
      alert(error)
    }
  }
  useEffect(()=>{
    const q= query(collection(db, "Messages"), orderBy("createdAt", 'asc'))
    const unsubsribe= onAuthStateChanged(auth, (data)=>{
        setUser(data)
    })

    const unsubsribeForMessages= onSnapshot(q, (snap)=>{
      setMessages(
        snap.docs.map((item)=>{
          const id= item.id;
          return{id, ...item.data()}
        })
      )
    })

    return()=>{
      unsubsribe();
      unsubsribeForMessages();
    } 
  }, [])
  return (
    <div className="App">
      <Box bg={"red.50"}>
        
        {user?(
            <Container  height={"100vh"} bg={"white"}>
            <VStack  height="full" paddingY='4'>
              <Button onClick={logOutHandler} width={"full"} colorScheme={"red"}>Logout</Button>
  
              <VStack height='full' width={'full'}overflowY="auto" css={{"&::-webkit-scrollbar":{
                display: "none"
              }}}>
                {
                  messages.map(((item)=>
                    <Message
                    key={item.id}
                    user={item.uid===user.uid?"me":'other'}  
                    text={item.text}
                    uri={item.uri}
                    />
                  ))
                }
                <div ref={divForScroll}></div>
              </VStack>
              
              <form style={{width: "100%" }}>  
                <HStack>
                
                  <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Type a message..."/>
                  <Button onClick={submitHandler} colorScheme={"purple"} type='submit'>Send</Button>
                
                </HStack>
              </form>
            </VStack>
          </Container>
        ):<Container>
          <VStack justifyContent={"center"} height={"100vh"}>
            <Button onClick={loginHandler}>Sign In</Button>
          </VStack>
        </Container>
        
        }
      </Box>
    </div>
  );
}

export default App;
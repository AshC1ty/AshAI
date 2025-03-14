import { Link } from 'react-router-dom'
import './chatList.css'
import { useQuery } from '@tanstack/react-query'

const ChatList = () => {

  const {isPending, error, data} = useQuery({
    queryKey: ["userchats"],
    queryFn:  () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,{credentials: "include"}).then((res) => res.json())
  })


  return (
    <div className='chatList'>
        <span className='title'>Dashboard</span>
        <Link to='/dashboard'>Create a new Chat</Link>
        {/* <Link to='/'>Explore LoanAdvisor</Link>
        <Link to='/'>Contact</Link> */}
        <hr />
        <span className='title'>Recent Chats</span>
        <div className="list">
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.slice().reverse().map((chat) => (
              <Link to={`/dashboard/chat/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
      </div>
        <hr />
        <div className="upgrade">
            <img src="/logo.png" alt="" />
            <div className="texts">
                <span>Thanks for using my service</span>
                <span>Made by AshC1ty</span>
            </div>
        </div>
    </div>
  )
}

export default ChatList
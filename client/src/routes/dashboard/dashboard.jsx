import './dashboard.css'
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const queryClient = useQueryClient();
  
    const navigate = useNavigate();
  
    const mutation = useMutation({
      mutationFn: (text) => {
        return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }).then((res) => res.json());
      },
      onSuccess: (id) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["userChats"] });
        navigate(`/dashboard/chat/${id}`);
      },
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const text = e.target.text.value;
      if (!text) return;
  
      mutation.mutate(text);
    };

  return (
    <div className='dashboard'>
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>Ash AI</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>Who is Mandela</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Tell me a poem</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>How to learn java</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit} autoComplete='off'>
          <input type="text" name="text" placeholder="How can I help you today..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard;
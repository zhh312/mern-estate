import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [Landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {  
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLandlord();
    },[listing.userRef])

    const onChange = (e) => {
        setMessage(e.target.value);
    }

  return (
    <>
      {Landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{Landlord.username}</span>{" "}
            for{" "}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Type your message here'
            className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent'
          ></textarea>
          <Link to={`mailto:${Landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
          Send Message
          </Link>
        </div>
      )}
    </>
  );
}

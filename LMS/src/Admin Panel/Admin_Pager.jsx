import react from 'react';
import { useParams } from 'react-router-dom';
import Tasks from './Tasks';
import Details from './Details';
function Admin_pager({setIsLoggedIn}) {
    const { newpage } = useParams();
    switch (newpage) {
        case 'Assign-Tasks':
            return <Tasks setIsLoggedIn={setIsLoggedIn} />
        case 'Change-Details':
            return <Details setIsLoggedIn= {setIsLoggedIn}/>
        default:
            return <>404 - No Page Found</>

    }
}
export default Admin_pager;
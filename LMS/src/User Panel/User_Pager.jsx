import react from 'react';
import { useParams } from 'react-router-dom';
import Settings from './Settings';
function User_pager(){
    const {new_page} = useParams();
    switch(new_page){
        case 'Account-Settings':
            return <Settings/>
        default:
            return <>404 - No Page Found</>
            
    }
}
export default User_pager;
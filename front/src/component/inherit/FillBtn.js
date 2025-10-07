import { Link } from 'react-router-dom';
import './inherit.css';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function FillBtn(props){
    const dataAuth = props.dataAuth;

    return (
        <Link to={(dataAuth === true)? props.to: '/register'} className='gradient-btn1 fill-btn'>{props.name} {props.subscribe?<LockOpenIcon sx={{fontSize:'1.3em', marginBottom:'2px'}} />:null}</Link>
    )
}
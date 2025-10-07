import { Container } from "react-bootstrap";
import errorImage from '../../assets/images/errors/404.png';
import { Button, Link } from "@mui/material";


export const $404 = (props) => {
    return (
        <Container style={{'backgroundColor':'var(--color-dark-2)'}}>
            <div className='w-100 d-flex justify-content-center align-items-center flex-column gap-2' style={{ 'backgroundColor': 'var(--color-dark-2)', 'minHeight': '70vh' }}>
                <img width={350} src={errorImage} alt='error_403_image' />
                <span className='fw-bold text-center mb-4' dir='rtl' style={{ 'fontSize': '1.5em','color':'var(--text-cyan-700)' }}>{props.message}</span>
                <Button variant="contained" sx={{backgroundColor:'var(--color-cyan-700)', color:'var(--color-default2)'}} component={Link} to={props.to}>الذهاب إلى الصفحة الرئيسية</Button>
            </div>
        </Container>
    )
};
import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Container = styled(motion.div)`
    position: fixed;
    width: 100%;
    padding-top:20px;
    background-color: black;
    z-index: 50;
`;

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:12px;
    color: ${props => props.theme.white.darker};
    margin: 0 45px;
    padding: 8px 0;

`;

const Col = styled.div`
    display: flex;
    align-items: center;
`;

const Logo = styled(motion.svg)`
    margin-right:50px;
    width: 108px;
    height:32px;
    cursor:pointer;
    /* path{
        stroke: white;
        stroke-width:3;
    } */
`;


const Items = styled.ul`
    display: flex;
    align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${props => props.theme.white.darker};
    transition: color .3s ease-in-out;
    position: relative;
    display: flex;
    flex-direction: column;
    &:hover{
        color:${props => props.theme.white.lighter};
    }
`;

const Circle = styled(motion.span)`
    position:absolute;
    height:5px;
    width: 5px;
    border-radius: 5px;
    bottom:-5px;
    left:0;
    right:0;
    margin:0 auto;
    background-color:  ${(props) => props.theme.red};

`
const Search = styled(motion.form)`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
    transform-origin: right center;
    background-color: inherit;
    width: 185px;
    color:${props=>props.theme.white.lighter};
    border: unset;
    padding: 5px 10px;
    /* position: absolute;
    left:-160px; */
`;


const logoVariants = {
    normal: {
        fillOpacity: 1,
    },
    active: {
        fillOpacity: [1, 0, 1, 0],
        stroke: "white",
        strokeWidth:[0,3,0,3],
        transition: {
            repeat: Infinity,
        }
    },
};

const navVariants = {
    top:{
        background:"linear-gradient(to top,rgba(0,0,0,0), rgba(0,0,0,1))",
    },
    scroll:{
        background: "linear-gradient(to top,rgba(0,0,0,0), rgba(0,0,0,1) 60%)",
    },
    end:{
        background: "linear-gradient(to top,rgba(0,0,0,0), rgba(0,0,0,1) 10%)",
    }
}

interface IForm{
    keyword:string;
}

function Header() {

    const {register, handleSubmit, setValue} =useForm<IForm>();

    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const homeMatch = useMatch("/");
    const tvMatch = useMatch("/tv");
    const inputAnimation = useAnimation();
    const navAnimation = useAnimation();
    const {scrollY} = useScroll();

    const moveHome = ()=>{
        navigate("/");
    };

    const openSearch = () => {
        if(searchOpen){
            // trigger the close animation
            inputAnimation.start({
                scaleX:0,
            });
        }else{
            // trigger the open animation
            inputAnimation.start({
                scaleX:1,
            });
        }
        setSearchOpen(prev => !prev);
    };

    const onValid = (data:IForm) =>{
        
        navigate(`/search?keyword=${data.keyword}`);

        setValue("keyword","");
    };

    useEffect(()=>{
        scrollY.onChange(()=>{
            if(scrollY.get() > 400){
                navAnimation.start("end");
            }
            else if(scrollY.get() > 100){
                navAnimation.start("scroll");
            }else{
                navAnimation.start("top");
            }
        });
    },[scrollY])

    return (
        <Container
        variants={navVariants}
        animate={navAnimation}
        initial="top">
            <Nav>
                <Col>
                    <Logo
                        variants={logoVariants}
                        // initial="normal"
                        onClick={moveHome}
                        whileHover="active"
                        viewBox="0 0 1024 276.742">
                        <motion.path xmlns="http://www.w3.org/2000/svg" d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" fill="#d81f26" />
                    </Logo>
                    <Items>
                        <Link to="/">
                            <Item>
                                Home 
                                {/* {homeMatch && <Circle layoutId="circle" />} */}
                            </Item>
                        </Link>
                        <Link to="/tv">
                            <Item>Tv Shows
                                {/* {tvMatch && <Circle layoutId="circle" />} */}
                            </Item>
                        </Link>
                    </Items>
                </Col>
                <Col>
                    <Search onSubmit={handleSubmit(onValid)}
                        animate={{border: searchOpen?"1px solid white":"none"}}
                        transition={{type:"linear"}}
                        >
                        <motion.svg
                            onClick={openSearch}
                            animate={{x:searchOpen?0:200}}
                            transition={{type:"linear"}}
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path xmlns="http://www.w3.org/2000/svg"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            >
                            </path>
                        </motion.svg>
                        <Input
                            {...register("keyword", {required:true, minLength:2})}
                            animate={inputAnimation}
                            initial={{scaleX:0}}
                            transition={{type:"linear"}}
                            placeholder="Search for movie or tv show...">
                        </Input>
                    </Search>
                </Col>
            </Nav>
        </Container>
    )
}


export default Header;
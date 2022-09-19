import { useRef,useEffect } from 'react'
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useAnimation, useScroll } from "framer-motion";
import { url } from "inspector";
import { useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getLatest, getMovies, getPopular, getTopRated, getUpcomming, IGetMoviesResult, IMovie } from "../api";
import { makeImagePath } from "../util";
import Slider from '../Component/Slider';
import MovieDetail from '../Component/MovieDetail';

const Wrapper = styled.div`
    background-color: black;
    overflow-x: hidden;
`;

const Loader = styled.div`
    height: 20vh;
    display:flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
    height:80vh;
    display: flex;
    flex-direction: column;
    justify-content:center;
    padding:60px;
    background-image:  linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${props => props.bgphoto});
    background-size: cover;
    background-position: left center;
`;

const Title = styled.h2`
    font-size: 36px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 14px;
    width: 50vw;
    text-indent: 5px;
`;

const SliderCompo = styled.div`
    position: relative;
    top:-100px;
    margin-bottom: 150px;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6,1fr);
    gap: 10px;
    position: absolute;
    width: 100%;
    padding: 0px 20px;
`;

const Box = styled(motion.div) <{ bgPhoto: string }>`
    background-color: white;
    color:white;
    font-size: 16px;
    height: 200px;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    cursor: pointer;
    position:relative;
    &:first-child{
        transform-origin: center left;
    }

    &:last-child{
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
  padding:10px;
  height:50px;
  background-color  : ${props => props.theme.black.lighter};
  opacity:0;
  position:absolute;
  width: 100%;
  bottom:0;
  h4{
    font-size:14px;
  }
`;


const Overlay = styled(motion.div)`
  position  : fixed;
  z-index: 50;
  top:0;
  width: 100%;
  height:100%;
  background-color: rgba(0,0,0,0.6);
  opacity: 0;
`;

const BigMovie = styled(motion.div) <{ scrollY?: number }>`
    z-index: 51;
    position: absolute;
    width: 60vw;
    height: 80vh;
    top:${props => props.scrollY}px;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${props => props.theme.black.lighter};
    
`;

const BigCover = styled.div<{ bgPhoto: string }>`
    width: 100%;
    height:350px;
    background-image: linear-gradient(to top, black,transparent),url(${props => props.bgPhoto});
    background-size:cover;
    background-position:center center;

`;

const Bigtitle = styled.h3`
    color:${props => props.theme.white.lighter};
    padding: 10px;
    font-size: 20px;
    position:relative;
    top:-40px;
`;

const BigOverView = styled.p`
    padding : 10px;
    top:-40px;
    position:relative;
    color:${props => props.theme.white.lighter};
    text-indent: 5px;

`

const rowVariants = {
    hidden: {
        x: window.innerWidth,
    },
    visible: {
        x: 0
    },
    exit: {
        x: -window.innerWidth,
    },
};

const boxVariants = {
    nomal: {
        scale: 1,
    },
    hover: {
        zIndex: 99,
        scale: 1.3,
        y: -50,
        border: "2px solid #fff",
        transition: {
            delay: 0.5,
            duration: 0.4,
            type: "tween"
        }
    }
};

const infoVariants = {
    hover: {
        opacity: 1,
    },

};

const offset = 6;

function Home() {
    const { scrollY } = useScroll();
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId/:type");

    const location = useLocation();
    //const params = new URLSearchParams(location.search);


    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const { data:popularData, isLoading:isPopularLoading } = useQuery<IGetMoviesResult>(["movies", "popular"], getPopular);
    const { data: topRated, isLoading: isTopRatedLoading } = useQuery<IGetMoviesResult>(["movies", "topRated"], getTopRated);
    const { data: upcommaing, isLoading: isUpcommingLoading } = useQuery<IGetMoviesResult>(["movies", "upcomming"], getUpcomming);

    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        // if (data) {
        //     if (leaving) return;
        //     setLeaving(true);
        //     const totalMovies = data.results.length;
        //     const maxIndex = Math.floor(totalMovies / offset) - 1;
        //     setIndex(prev => maxIndex === prev ? 0 : prev + 1);
        // }
    };
    const toggleLeaving = () => setLeaving(prev => !prev);

    const onBoxClick = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };

    const onOverlayClick = () => {
        navigate(`/`);
    }

    const clickedMovie = bigMovieMatch?.params.movieId && 
        data?.results.find(movie => movie.id.toString() === bigMovieMatch.params.movieId);

        
    const onMovieClick = (movieId: number, privateKey:string) => {
        navigate(`/movies/${movieId}/${privateKey}`);
    };

        
    useEffect(()=>{
        const bannderIdx = Math.floor(Math.random() * 10);
        setIndex(bannderIdx);
    },[]);

    return (
        <Wrapper>
            {isLoading ? <Loader>Loading...</Loader> :
                <>
                    <Banner onClick={increaseIndex} bgphoto={makeImagePath(data?.results[index].backdrop_path || "")}>
                        <Title>{data?.results[index].title}</Title>
                        <Overview>{data?.results[index].overview}</Overview>
                    </Banner>
                    {/* <SliderCompo>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row key={index}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1, }}
                            >
                                {data?.results.slice(offset * index, offset * index + offset).map(movie => {
                                    return (
                                        <Box key={movie.id} bgPhoto={makeImagePath(movie.poster_path, "w500")}
                                            initial="nomal"
                                            whileHover="hover"
                                            variants={boxVariants}
                                            layoutId={movie.id.toString()}
                                            onClick={() => onBoxClick(movie.id)}
                                        >
                                            <Info
                                                variants={infoVariants}
                                            >
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    )
                                })}
                            </Row>
                        </AnimatePresence>
                    </SliderCompo>  */}
                    <div style={{position:"relative", top:-40, margin:'0 30px'}}>
                        <Slider privateKey="now" title="상영중" datas={data?.results} onItemClick={onMovieClick}/>
                        
                        {isPopularLoading ? <span>Loading</span>:
                           (
                           <Slider privateKey="popular" title="인기" datas={popularData?.results.sort(
                            (a,b) =>
                            {
                                return b.vote_average-a.vote_average;
                            }
                           )}
                           onItemClick={onMovieClick}
                           />   
                           )
                        }

                        {isTopRatedLoading ? <span>Loading</span>:
                        <Slider privateKey="topRated" title="최고 평점" datas={topRated?.results.slice(0,10)} showIndex={true}
                        onItemClick={onMovieClick}/>}
                        <Slider privateKey="upcomming" title="개봉예정" datas={upcommaing?.results} onItemClick={onMovieClick}/>
                    </div>


                    <AnimatePresence>
                        {bigMovieMatch ? (
                            // <>
                            //     <Overlay
                            //         onClick={onOverlayClick}
                            //         animate={{ opacity: 1 }}
                            //         exit={{ opacity: 0 }}
                            //     />
                            //     <BigMovie
                            //         layoutId={bigMovieMatch.params.movieId}
                            //         scrollY={scrollY.get() + 100}
                            //     >
                            //         {clickedMovie &&
                            //             <>
                            //                 <BigCover bgPhoto={makeImagePath(clickedMovie.backdrop_path)} />
                            //                 <Bigtitle>{clickedMovie.title}</Bigtitle>
                            //                 <BigOverView>{clickedMovie.overview}</BigOverView>
                            //             </>}
                            //     </BigMovie>
                                
                            // </>
                            <MovieDetail type={bigMovieMatch.params.type}
                             movieId={bigMovieMatch.params.movieId}
                              scrollY={scrollY.get()+100}/>
                        ) : null}
                    </AnimatePresence>
                </>}
        </Wrapper>
    )
}

export default Home;
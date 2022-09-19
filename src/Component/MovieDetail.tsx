import { useQuery } from "@tanstack/react-query";
import { motion, useScroll } from "framer-motion";
import { url } from "inspector";
import { useEffect,useState } from "react";
import { Link, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getCredits, getMovie, ICreditsResult, IMovie } from "../api";
import MovieDetailInfo from "../Routes/MovieDetailInfo";
import SimilarMovie from "../Routes/SimilarMovies";
import { makeImagePath } from "../util";

const Overlay = styled(motion.div)`
  background-color: rgba(0,0,0,0.6);
  position: fixed;
  top: 0;
  width: 100%;
  height:100%;
  opacity: 0;
`;

const MovieContainer = styled(motion.div)<{scrollY?:number}>`
    position:absolute;
    width:60vmax;
    height:80vh;
    max-width: 700px;
    background-color: black;
    border-radius: 10px;
    overflow: auto;
    left:0;
    right:0;
    top:${props=>props.scrollY}px;
    margin:0 auto;
    box-shadow: 10px 10px 10px 0 rgba(10,10,10,1);
`;

const ExitButton = styled.button`
    position:absolute;
    top:0;
    right:0;
    width: 40px;
    height: 40px;
    margin:10px;
    background-color: transparent;
    border: 0px solid;
    border-radius: 20px;
    cursor: pointer;
    svg{
        fill:white;
    }

    &:hover{
        svg{
            fill:${props=>props.theme.white.darker};
        }
    }
`;

const BackDropImage = styled.div<{bgpoth:string}>`
    width: 100%;
    height: 30vh;
    background-image: linear-gradient(to bottom, rgba(0,0,0,0), black),url(${props=>props.bgpoth});
    background-size: cover;
    background-position: top center;
    
`;

const Info = styled.div`
  padding: 0 30px;  
`;

const Title = styled.q`
    font-size:24px;
    font-weight: bold;
`

const ScreenInfo = styled.div`
    margin: 10px 0px;
    font-size:12px;
    line-height: 1.5;
`;

const CompanyLogo = styled.img`
    width: 100px;
    height: 50px;

`;

const Genere = styled.span`
    margin-right: 5px;
`;

const OverView = styled.div`
    text-indent:10px;
    margin:10px 0;
`;

const Tabs = styled.nav`
    display: flex;
    margin-bottom: 10px;
    border-bottom: 1px solid ${props=>props.theme.black.lighter};
`;

const Tab = styled(motion.div)<{isActive?:boolean}>`
    padding:10px 0;
    margin-right: 20px;
    position:relative;
    user-select: none;
    cursor: pointer;
    border-bottom: 3px solid ${props=>props.isActive? "white":"transparent"};
    &:hover{
        border-bottom: 3px solid white;
    }
`;

const ActorList = styled.div`
  display  : grid;
  grid-template-columns: repeat(5,1fr);
  gap:5px;
`;

const ActorProfile = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
`;

const ActorProfileImg = styled.div<{bgphoto:string}>`
    background-color: white;
    height:150px;
    background: url(${props=>props.bgphoto});
    background-size: cover;
    border-radius:5px;
`;

interface IMovieDetail{
    scrollY:number,
    movieId:string|undefined,
    type?:string,
    onBackPage?:()=>void,
}

const TYPE_CAST = "CAST";
const TYPE_SIMILAR="SIMILAR";


function MovieDetail({scrollY, movieId,type,onBackPage}:IMovieDetail){
    const navigate = useNavigate();
    
    const onOverlayClick = () => {
        if(onBackPage){
            onBackPage();
        }else{
            navigate(`/`);
        }
        
    }

    const [tabType, setTabType] = useState(TYPE_CAST);

    const {data, isLoading} = useQuery<IMovie>(["movie",movieId], ()=> {return getMovie(movieId!)});
    const {data:credits, isLoading:isCreditsLoading} =  useQuery<ICreditsResult>([movieId, "credits"], ()=>{return getCredits(movieId!)});
    
    const onTabClick =(target:string)=>{
        setTabType(target);
    };

    useEffect(()=>{
        setTabType(TYPE_CAST);
    },[isLoading]);

    return(
        <>
            <Overlay
                animate={{opacity:1}}
                exit={{opacity:0}}
                onClick={onOverlayClick}
                >
            </Overlay>
            <MovieContainer 
                layoutId={`${type}_${movieId}`}
                scrollY={scrollY}
            >
                <ExitButton
                 onClick={onOverlayClick}>
                <svg viewBox="0 0 26 26" focusable="true">
                    <path d="M10.5 9.3L1.8 0.5 0.5 1.8 9.3 10.5 0.5 19.3 1.8 20.5 10.5 11.8 19.3 20.5 20.5 19.3 11.8 10.5 20.5 1.8 19.3 0.5 10.5 9.3Z"></path>
                </svg>
                </ExitButton>
                {isLoading || 
                <>
                    <BackDropImage bgpoth={makeImagePath(data?.backdrop_path || "")}/>
                    <Info>
                        <Title>{data?.title}</Title>
                        <ScreenInfo>
                            <p>{new Date(data?.release_date!).getFullYear()} • {data?.runtime} min.</p>
                            <p>{data?.genres.map((genre) => <Genere key={genre.id}>#{genre.name}</Genere>)}</p>
                            <p>Vote Average : {data!.vote_average.toFixed(1)}</p>
                        </ScreenInfo>
                        <OverView>
                            <span>
                                {data?.overview}
                            </span>
                        </OverView>
                        <Tabs>
                            <Tab onClick={()=>onTabClick(TYPE_CAST)} isActive={tabType===TYPE_CAST}>Cast & Crew</Tab>
                            <Tab onClick={()=>onTabClick(TYPE_SIMILAR)} isActive={tabType===TYPE_SIMILAR}>Similar</Tab>
                        </Tabs>
                        
                        <div>
                            {tabType===TYPE_CAST ? 
                            (<ActorList>
                                {credits?.cast.slice(0,5).map((actor)=> 
                                <ActorProfile key={actor.id}>
                                    <ActorProfileImg bgphoto={makeImagePath(actor.profile_path,"w200")}>
                                    </ActorProfileImg>
                                    <div>
                                        <p style={{fontSize:14}}>{actor.name}</p>
                                        <p style={{fontSize:10, color:'gray'}}>{actor.character}</p>
                                    </div>
                                </ActorProfile>
                                )}
                            </ActorList>)
                            : null}
                            {tabType===TYPE_SIMILAR ? 
                            <SimilarMovie movieId={movieId!}/>
                            : null}
                        </div>
                    </Info>
                    
                </>
                }
            </MovieContainer>
        </>
    )
}


export default MovieDetail;
import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import styled from "styled-components";
import { getTvShowCredits, getTvShowEpisodes, getTvShowInfo, ICreditsResult, IGetTvShowSeasons, ITvShow } from "../api";
import { makeImagePath } from "../util";
import Episode from './Episode';

const Overlay = styled(motion.div)`
    position: fixed;
    width: 100%;
    height:100%;
    background-color: rgba(0,0,0,0.6);
    top:0;
    opacity: 0;
`;

const Container = styled(motion.div) <{ top?: number }>`
    position:absolute;
    background-color: black;
    width: 80vw;
    min-width: 300px;
    height:80vh;
    top:${props => props.top}px;
    left:0;
    right:0;
    margin:0 auto;
    border-radius: 10px;
    box-shadow: 10px 10px 10px 0 rgba(10,10,10,1);
    overflow: auto;
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
            fill:${props => props.theme.white.darker};
        }
    }
`;

const BackDropImage = styled.div<{ bgpoth: string }>`
    width: 100%;
    height: 40vh;
    background-image: linear-gradient(to bottom, rgba(0,0,0,0), black),url(${props => props.bgpoth});
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
    border-bottom: 1px solid ${props => props.theme.black.lighter};
`;

const Tab = styled(motion.div) <{ isActive?: boolean }>`
    padding:10px 0;
    margin-right: 20px;
    position:relative;
    user-select: none;
    cursor: pointer;
    border-bottom: 3px solid ${props => props.isActive ? "white" : "transparent"};
    &:hover{
        border-bottom: 3px solid white;
    }
`;

const ActorList = styled.div`
  display  : grid;
  grid-template-columns: repeat(5,100px);
  gap:5px;
`;

const ActorProfile = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
`;

const ActorProfileImg = styled.div<{ bgphoto: string }>`
    background-color: white;
    height:150px;
    background: url(${props => props.bgphoto});
    background-size: cover;
    border-radius:5px;
`;

interface ITvShowDetail {
    scrollY: number,
    tvShowId: string | undefined,
    type?: string,
    onBackPage?: () => void;
}


const TYPE_CAST = "CAST";
const TYPE_SIMILAR = "SIMILAR";
const TYPE_EPISODE = "EPISODE";

function TvShowDetail(props: ITvShowDetail) {


    const { data, isLoading } = useQuery<ITvShow>(["tv", props.tvShowId], () => getTvShowInfo(props.tvShowId!));
    const { data: credits, isLoading: isCredits } = useQuery<ICreditsResult>(["tv_credits", props.tvShowId], () => getTvShowCredits(props.tvShowId!));
    
    
    const seasonNum = data?.number_of_seasons;
    const {data:seasons, isLoading:isSeasons} = useQuery<IGetTvShowSeasons>
    (["tv_seasons", props.tvShowId], 
    ()=> getTvShowEpisodes(props.tvShowId!, seasonNum!.toString()),
    {
        enabled: !!seasonNum,
    }
    );


    const [tabType, setTabType] = useState(TYPE_EPISODE);

    const onTabClick = (target: string) => {
        setTabType(target);
    };


    return (
        <>
            <Overlay
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={props.onBackPage}>
            </Overlay>
            <Container top={props.scrollY}
                layoutId={`${props.type}_${props.tvShowId}`}>
                <ExitButton
                    onClick={props.onBackPage}>
                    <svg viewBox="0 0 26 26" focusable="true">
                        <path d="M10.5 9.3L1.8 0.5 0.5 1.8 9.3 10.5 0.5 19.3 1.8 20.5 10.5 11.8 19.3 20.5 20.5 19.3 11.8 10.5 20.5 1.8 19.3 0.5 10.5 9.3Z"></path>
                    </svg>
                </ExitButton>
                {
                    isLoading ||
                    <>
                        <BackDropImage bgpoth={makeImagePath(data?.backdrop_path || "")} />
                        <Info>
                            <Title>{data?.name}</Title>
                            <ScreenInfo>
                                <p>{data?.first_air_date} ~ {data?.last_air_date}</p>
                                <p>{data?.genres.map((genre) => <Genere key={genre.id}>#{genre.name}</Genere>)}</p>
                                <p>Vote Average : {data!.vote_average.toFixed(1)}</p>
                            </ScreenInfo>
                            <OverView>
                                <span>
                                    {data?.overview}
                                </span>
                            </OverView>
                            <Tabs>
                                <Tab onClick={() => onTabClick(TYPE_EPISODE)} isActive={tabType === TYPE_EPISODE}>Episode</Tab>
                                <Tab onClick={() => onTabClick(TYPE_CAST)} isActive={tabType === TYPE_CAST}>Cast</Tab>
                                <Tab onClick={() => onTabClick(TYPE_SIMILAR)} isActive={tabType === TYPE_SIMILAR}>Similar</Tab>
                            </Tabs>

                            <div>
                                {
                                    tabType===TYPE_EPISODE?
                                    (<div>
                                        {isSeasons|| 
                                            <div>
                                                <p>{seasons?.name}</p>
                                                    {seasons?.episodes.slice(0, 10).map((episode,index) => (
                                                        // <div>
                                                        //     <p>{episode.episode_number}.{episode.name}</p>
                                                        //     <p>{episode.overview}</p>
                                                        // </div>
                                                        <Episode title={episode.name} 
                                                        epNumber={episode.episode_number}
                                                        stillCutUrl={makeImagePath(episode.still_path)}
                                                        overView={episode.overview}/>
                                                    ))}
                                            </div>
                                        }
                                    </div>)
                                    :null
                                }

                                {tabType === TYPE_CAST ?
                                    (<ActorList>
                                        {isCredits ||
                                            credits?.cast.slice(0, 5).map((actor) =>
                                                <ActorProfile key={actor.id}>
                                                    <ActorProfileImg bgphoto={makeImagePath(actor.profile_path, "w200")}>
                                                    </ActorProfileImg>
                                                    <div>
                                                        <p style={{ fontSize: 14 }}>{actor.name}</p>
                                                        <p style={{ fontSize: 10, color: 'gray' }}>{actor.character}</p>
                                                    </div>
                                                </ActorProfile>
                                            )}
                                    </ActorList>)
                                    : null}
                                {/* {tabType===TYPE_SIMILAR ? 
                            <SimilarMovie movieId={movieId!}/>
                            : null} */}
                            </div>
                        </Info>
                    </>
                }
            </Container>
        </>
    );
}


export default TvShowDetail;
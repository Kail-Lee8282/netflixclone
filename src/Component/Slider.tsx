import { motion, useAnimation } from "framer-motion";
import { useRef, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMovie, ITvShow } from "../api";
import { makeImagePath } from "../util";


interface ISliderProps {
    title?: string,
    datas: IMovie[] | ITvShow[]|undefined,
    privateKey: string,
    showIndex?: boolean,
    height?:number;
    thumbnailWidth?:number;
    arrBtnWidth?:number;
    onItemClick?:(id:number, privateKey:string)=>void;
}

enum SlidePosition {
    START = "START",
    MIDDLE = "MIDDLE",
    END = "END",
}

const boxHorizonMargin = 15;



const Container = styled.div`
    position:relative;
    overflow: hidden;
`;

const Title = styled.div`
    
  padding:0 10px;
`;

const SlideContainer = styled.div`
  background-color  :  black;  
  padding: 20px 0px;
  position:relative;
`;

const SlideMoveButton = styled.div<{ direction: "left" | "right" , arrBtnWidth:number}>`
  background: linear-gradient(to ${props => props.direction},rgba(0,0,0,0), black 90%);
  ${props => props.direction}:0;
  width: ${props=> props.arrBtnWidth}px;
  height: 100%;
  top:0;
  position: absolute;
  display: flex;
  justify-content:center;
  align-items: center;
  place-self: center;
  cursor: pointer;
  svg{
    fill:white;
    visibility: hidden;
  }

  &:hover{
    svg{
        visibility: visible;
    }
    }


`;

const RowContainer = styled(motion.div)`
  gap:10px;
  display:inline-flex;
  padding:0 10px;
`;


const InfoBox = styled(motion.div) <{ bgphoto: string, showIndex: boolean, imgHeight:number, imgWidth:number }>`
    position: relative;
    background-color:black;
    width: ${props=>props.imgWidth}px;
    height: ${props=>props.imgHeight?props.imgHeight:240}px;
    background-image:url(${props => props.bgphoto});
    background-size:cover;
    background-position:center center;
    border-radius: 10px;
    transform-origin: center center;
    margin: ${props => props.showIndex ? `0 ${boxHorizonMargin}px` : "0"};
    &:hover{
        border: 2px solid white;
    }
`;

const ItemVariants = {
    hover: {
        scale: 1.05,
    }
}


function Slider({ datas, title, privateKey, showIndex = false, height=240, thumbnailWidth=150, arrBtnWidth=60, onItemClick}: ISliderProps) {
    
    const navigate = useNavigate();

    const slideRef = useRef<HTMLDivElement>(null);
    const showSlideRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<SlidePosition>(SlidePosition.START);

    const [moveX, setMoveX] = useState(0);
    const slideAni = useAnimation();
    let itemWidth = (thumbnailWidth + 10 ); // 이미지 너비 + gap 
    
    if(showIndex) itemWidth += (boxHorizonMargin*2);

    const movePage = (direction: "left" | "right") => {
        if (datas) {
            //표시되는 썸네일 개수
            const viewCnt = Math.floor((showSlideRef.current!.clientWidth - (arrBtnWidth * 2)) / itemWidth);
            //최대 이동 축
            const maxMove = -(slideRef.current!.clientWidth - (showSlideRef.current!.clientWidth));
            
            let move = 0;

            if (direction === "right") {
                move = (-(viewCnt * itemWidth)) + moveX;
                if(moveX === 0) move += arrBtnWidth;
                if (move <= maxMove) {
                    move = maxMove;
                    setPosition(SlidePosition.END);
                } else {
                    setPosition(SlidePosition.MIDDLE);
                }
            } else if (direction === "left") {
                move = moveX + ((viewCnt * itemWidth));
                if(moveX === maxMove) move -= arrBtnWidth;
                if (move >= 0) {
                    move = 0;
                    setPosition(SlidePosition.START);
                } else {
                    setPosition(SlidePosition.MIDDLE);
                }

            }

            slideAni.start(
                {
                    x: move,
                    transition: {
                        duration: 1,
                    },
                }
            );

            setMoveX(move);
        }
    };

    // const onBoxClick = (movieId: number) => {
    //     navigate(`/movies/${movieId}?type=${privateKey}`);
        
    // };

    useEffect(()=>{
        setMoveX(0);
    },[]);

    return (
        <Container>
            <Title>
                <h3>{title}</h3>
            </Title>
            <SlideContainer
                ref={showSlideRef}>

                <RowContainer
                    ref={slideRef}
                    
                    initial={{ x: 0, }}
                    animate={slideAni}
                >
                    {datas?.map((movie, index) => {
                        return (
                            <div style={{position:"relative"}}>
                                <InfoBox
                                    key={movie.id}
                                    layoutId={`${privateKey}_${movie.id}`}
                                    variants={ItemVariants}
                                    whileHover="hover"
                                    bgphoto={makeImagePath(movie.poster_path, "w300")}
                                    showIndex={showIndex}
                                    onClick={() => onItemClick&&onItemClick(movie.id, privateKey)}
                                    imgHeight={height}
                                    imgWidth={thumbnailWidth}
                                >
                                </InfoBox>
                                {showIndex && <motion.span variants={undefined} whileHover="" 
                                style={{ fontSize: 100, position: `absolute`, left: -20, bottom: 0, color: `black`, WebkitTextStroke: `1px white`, fontWeight:'bold' }}>{index + 1}</motion.span>}
                            </div>
                        );

                    })}
                </RowContainer>

                {position !== SlidePosition.START &&
                    <SlideMoveButton
                        direction="left"
                        arrBtnWidth={arrBtnWidth}
                        onClick={() => movePage("left")}>
                        <svg viewBox="0 0 36 36"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.324 28.008c.537.577.355 1.433-.326 1.809a1.44 1.44 0 0 1-.72.183c-.398 0-.786-.151-1.048-.438L10.06 18.588a1.126 1.126 0 0 1 0-1.555L20.233 6.09c.438-.468 1.198-.564 1.767-.25.681.377.863 1.23.325 1.808l-9.446 10.164 9.446 10.196zM11.112 17.615a.31.31 0 0 1 0 .391l.182-.195-.182-.196zM21.308 7.094c-.01-.006-.053 0-.029-.027a.07.07 0 0 0 .029.027zm-.025 21.499a.95.95 0 0 1-.006-.008l.006.008z">
                            </path>
                        </svg>
                    </SlideMoveButton>
                }

                {
                    position !== SlidePosition.END &&
                    <SlideMoveButton
                        direction="right"
                        arrBtnWidth={arrBtnWidth}
                        onClick={() => movePage("right")}>
                        <svg viewBox="0 0 36 36"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.065 7.65c-.538-.578-.355-1.433.325-1.81a1.44 1.44 0 0 1 .72-.182c.398 0 .786.15 1.048.437L25.327 17.07a1.126 1.126 0 0 1 0 1.555L15.155 29.568c-.438.468-1.198.563-1.767.25-.681-.377-.863-1.23-.325-1.809l9.446-10.164L13.065 7.65zm11.211 10.393a.31.31 0 0 1 0-.391l-.181.194.181.197zM14.081 28.564c.01.006.053 0 .028.027a.07.07 0 0 0-.028-.027zm.024-21.5a.95.95 0 0 1 .007.008l-.007-.007z"></path>
                        </svg>
                    </SlideMoveButton>}
            </SlideContainer>
        </Container>
    )
}


export default Slider;
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    margin: 10px 0;
`;

const StillCut = styled.div<{src:string|undefined}>`
    min-width: 130px;
    height: 80px;
    background-image: url(${props=>props.src});
    background-size: cover;
    border-radius:5px;
    background-color: darkgray;
`;

const InfoWapper = styled.div`
    margin-left:10px;
    text-align: left;
`;

const EpName = styled.p`
    font-size:16px;
    
`;
const EpOverView = styled.p`
    font-size:12px;
`;

interface IEpisode{
    title?:string;
    epNumber?:number;
    stillCutUrl?:string;
    overView?:string;
}

function Episode(props:IEpisode){
    return(
        <Container>
            <StillCut src={props.stillCutUrl}/>
            <InfoWapper>
                <EpName>{props.epNumber}. {props.title}</EpName>
                <EpOverView>{props.overView}</EpOverView>
            </InfoWapper>
            
        </Container>
    )
}


export default Episode;
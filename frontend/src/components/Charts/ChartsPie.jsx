import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Info,valueFormatter } from './Info';
import { useDrawingArea } from '@mui/x-charts';
import { styled } from '@mui/material/styles';



function ChartsPie(props) {
    return (
        
        <>
            <PieChart
                colors={props.colors}
                series={[
                    {
                        
                        ...data,
                        arcLabel: 'label',
                        arcLabelMinAngle: 10,
                        arcLabelRadius: '100%',
                        innerRadius: 100,
                        outerRadius: 150,
                        paddingAngle: 0,
                        cornerRadius: 0,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: {innerRadius: 50, outerRadius: 100,paddingAngle: 0, cornerRadius: 0, color: 'gray' },
                        cx: 250,
                        cy: 200
                    },

                ]}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fontWeight: 'bold',
                        fontSize: 20,
                        fill: "white"
                    },
                    '& .MuiPieArc-root': {
          stroke: 'none',
        },
                }}

                
                width={500}
                height={400}
            >
                <PieCenterLabel>Daily Spendings</PieCenterLabel>
            </PieChart>
        </>

    )
}

const data = {
    data: Info,
    valueFormatter,
}



const StyledText = styled('text')(() => ({
  fill: "white",
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({children}){
    const {width, height, left, top} = useDrawingArea();
    return (
        <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
        </StyledText>
    )
}



export default ChartsPie;
import { BarChart } from '@mui/x-charts';
import { Info,valueFormatter } from './Info';
import { margin, width } from '@mui/system';

const ChartSetting = {
    yAxis: [{ label: "Number of Transactions", width: 100 }],
    height: 400,
    margin: {left:0},
}

function ChartsBar() {
    return (

        <>
            <BarChart

                dataset={Info}
                xAxis={[{ 
                    dataKey: "label" ,
                    scaleType: "band",
                    categoryGapRatio: 0.3,
      barGapRatio: 0.1,
                }]}
                series={[{ dataKey: "value", label: "Transactions" }]}
                /* INTERCHANGE yAxis and xAxis to make it horizontal
                layout="horizontal"*/
                minBarSize={0}
                borderRadius={7}
                barLabel="value"
                grid={{horizontal: true}}
                
                {...ChartSetting}
            >
            </BarChart>
        </>

    )
}




export default ChartsBar;
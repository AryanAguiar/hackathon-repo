export const Info = [
    {
        label: "Series A",
        value: 45,
    },
    {
        label: "Series B",
        value: 50,
    },
    {
        label: "Series C",
        value: 30,
    },
    {
        label: "Series D",
        value: 60,
    },
    {
        label: "Series E",
        value: 38,
    },
    {
        label: "Series F",
        value: 20,
    },
];


const TOTAL = Info.map((item) => item.value).reduce((a, b) => a + b, 0);


export const valueFormatter = (item) => `${item.value}`;
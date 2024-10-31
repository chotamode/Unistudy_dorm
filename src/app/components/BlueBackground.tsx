const BlueBackground = () => {
    return (
        <div className="absolute -top-[11rem] bg-center w-full h-[40rem] bg-bg-stage3 bg-no-repeat z-10 md:hidden"
             style={{
                 backgroundSize: '110% 130%',
                 '@media (max-width: 500px)': {
                     width: '100vw',
                     backgroundSize: 'cover'
                 },
                 '@media (min-width: 501px) and (max-width: 768px)': {
                     width: '38rem',
                     backgroundSize: '110% 130%'
                 }
             }} />
    );
};

export default BlueBackground;
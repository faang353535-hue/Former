import AboutSection2 from "./about"
import Grid from "./grid"
const Aboutpage = () => {
    return (
        <>
            <div className="pt-20 bg-[radial-gradient(#00000033_1.5px,#f9fafb_1px)] bg-size:{20px_20px] dark:bg-[radial-gradient(#ffffff33_1px,#060606_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_150%_60%_at_51%_30%,#000_30%,transparent_115%)]">
                <AboutSection2 />
            </div>
            <Grid></Grid>
        </>
    )
}

export default Aboutpage
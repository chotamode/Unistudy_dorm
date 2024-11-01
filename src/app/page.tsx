import MainPage from './MainPage';
import Layout from './components/Layout';
import {ReservationContextProvider} from "@/app/context/YearGenderContext";

export default function Home() {
    return (
        // <YearGenderProvider>
            <Layout>
                <MainPage/>
            </Layout>
        // </YearGenderProvider>

    );
}
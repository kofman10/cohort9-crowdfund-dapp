import Campaigns from "./component/Campaigns";
import CreateCampaign from "./component/CreateCampaign";
import Header from "./component/Header";

function App() {
    return (
        <div className="App">
            <Header />
            <main className="mt-10">
                <CreateCampaign />
                <Campaigns />
            </main>
        </div>
    );
}

export default App;

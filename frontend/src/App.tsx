import { useState } from 'react'
import Header from './components/layout/Header'
import PageWrapper from './components/layout/PageWrapper'
import TicketCard from './components/ticket/TicketCard'
import ActionBar from './components/layout/ActionBar'
import SectionHeader from './components/ticket/SectionHeader'
import TicketToast from './components/ticket/TicketToast'
import FilterSheet from './components/ticket/FilterSheet'
import Confidential from '../../confidential'

export default function App() {
    const [currentView, setCurrentView] = useState<'My Tickets' | 'Create Ticket'>('My Tickets');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [toastState, setToastState] = useState<{ type: 'made' | 'deleted'; title: string } | null>(null);

    const toggleFilter = () => {
        setIsFilterOpen((prev) => !prev);
        if (toastState) setToastState(null);
    };

    return (
        <div className="min-h-screen bg-[#14452F] flex flex-col items-center relative">
        <Header userName='Naush' avatarUrl={Confidential({x:1})}/>
        <PageWrapper title={currentView}>
        <div className="flex flex-col">
            <SectionHeader status="Open"/>
            <TicketCard
                title="The 4th Floor Toilet is Clogged"
                description="Please send help to fix this, I really really need to go... >.<"
                status="Open"
                icon="clean"
            />
            <SectionHeader status="In-Progress"/>
            <TicketCard
                title="I NEED HELP!"
                description="1 Week until its all due"
                status="In-Progress"
                icon="help"
            />
            <SectionHeader status="Resolved"/>
            <TicketCard
                title="Classroom Cleaning"
                description="Classroom 4B seems to be very untidy"
                status="Resolved"
                icon="clean"
            />
            <TicketCard 
                title="Fix it"
                description="Classroom 4B has a broken chair"
                status="Resolved"
                icon="maintenance"
            />
            <SectionHeader status="Closed"/>
            <TicketCard 
                title="Help with sci studies"
                description="Im at the library"
                status="closed"
                icon="help"
            />
        </div>
        </PageWrapper>
        <ActionBar 
            onFilterClick={toggleFilter}
            onRefreshClick={() => setIsFilterOpen(false)} 
            onCreateClick={() => setCurrentView('Create Ticket')}
        />
        <FilterSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}/>
        {toastState && !isFilterOpen && ( 
            <TicketToast type={toastState.type} ticket={toastState.title}/>
        )} 
        </div>
    );
}
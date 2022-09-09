import React from 'react'
import MetaTags from '../components/Metatags'
import Navbar from '../components/Navbar'


const Index = () => {
    return (
        <>
            <MetaTags title={'Dashboard'} />
            <div className="container">
                <Navbar />
                <div className="row my-5">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-black text-center">Welcome!</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index
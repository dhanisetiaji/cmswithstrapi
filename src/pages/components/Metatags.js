import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'


const MetaTags = ({ title }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title} | CMS</title>
                <script ></script>
            </Helmet>
        </HelmetProvider>
    )
}

export default MetaTags
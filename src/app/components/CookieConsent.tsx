"use client";

import React, { useEffect, useState } from "react";

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem("cookieConsent", "rejected");
        setIsVisible(false);
    };

    return (
        isVisible && (
            <div className="fixed bottom-0 left-0 right-0 bg-blue-100 p-4 rounded-3xl flex max-laptop:flex-col flex-row justify-between items-center">
                    <p className="text-sm">
                        By clicking &quot;Accept Cookies&quot;, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.
                    </p>
                    <div className="flex mt-6 laptop:mt-0 space-x-2">
                        <button
                            onClick={handleReject}
                            className="bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Reject All
                        </button>
                        <button
                            onClick={handleAccept}
                            className="bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Accept All Cookies
                        </button>
                    </div>
            </div>
        )
    );
};

export default CookieConsent;

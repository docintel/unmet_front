import React from 'react'
import { Button } from 'react-bootstrap';

function NoData({
    image,
    title,
    description,
    buttonText,
    onClick
})
{
    const path_image = import.meta.env.VITE_IMAGES_PATH;

    return (
        <div className="no-data">
            <img src={`${path_image}${image}`} alt="no-data" />

            <h5>
                {title}
                <br />
                {description}
            </h5>

            {buttonText && (
                <Button className='explor-btn' onClick={onClick}>
                    {buttonText}
                    <img
                        src={`${path_image}left-arrow-white.svg`}
                        alt="arrow"
                    />
                </Button>
            )}
        </div>
    )
}

export default NoData;


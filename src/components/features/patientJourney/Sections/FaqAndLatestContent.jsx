import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { Button } from 'react-bootstrap';
import Content from '../Common/Content';

const FaqAndLatestContent = ({content,isFaq}) => {
    const [likedIndexes, setLikedIndexes] = React.useState([]);
    const path_image = import.meta.env.VITE_IMAGES_PATH  
            return (
                <div className="touchpoint-data-boxes">
                            {content ? (
                            content &&
                            content.map((section) => (
                                <React.Fragment key={section.id}>
                                <Content section={section} idx={section.id} />
                                </React.Fragment>
                            ))
                            ) : (
                            <div className="text-center  w-100">No data Found</div>
                            )}
                        </div> 
            )
        }

export default FaqAndLatestContent
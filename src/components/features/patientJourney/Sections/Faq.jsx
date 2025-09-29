import React, { useEffect, useState } from 'react'
import FaqAndLatestContent from './FaqAndLatestContent'
import { useContext } from 'react'
import { ContentContext } from '../../../../context/ContentContext'


const Faq = () => {

  const { content } = useContext(ContentContext);
  const [faqContent, setFaqContent] = useState([]);

  useEffect(()=>{
    const filteredData = content.filter(item => {
        const categoryLower = item.category.toLowerCase(); 
        return categoryLower === "faq"
        });
        setFaqContent(filteredData);
  },[])
  return (
    <FaqAndLatestContent content ={faqContent} isFaq = {true}/>
  )
}

export default Faq
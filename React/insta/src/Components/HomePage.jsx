import React from 'react'
import StoryPage from './StoryPage'
import MenuPage from './MenuPage'
import NewsPage from './NewsPage'

function HomePage() {
  return (
    <div>
      {/*<StoryPage></StoryPage>*/}
      {<NewsPage></NewsPage>}
      <MenuPage></MenuPage>
    </div>
  )
}

export default HomePage
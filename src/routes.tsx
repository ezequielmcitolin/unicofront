import { BrowserRouter, Switch, Route } from 'react-router-dom'
import UploadImages from './pages/Upload'

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
              <Route path="/" exact component={UploadImages} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes
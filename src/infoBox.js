import React from "react"

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import "./infoBox.css"

function InfoBox({onClick,title,cases,total}) {
    return (
        <div className="infoBox">
            <Card onClick={onClick}>
                <CardContent>
                    <Typography color="textPrimary" className="infoBox_title">
                        {title}
                    </Typography>
                    <h2 className="infoBox_cases">{cases}</h2>
                    <Typography color="textPrimary" className="infoBox_total">
                        Total:{total}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default InfoBox; 
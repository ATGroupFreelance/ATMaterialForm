import MUIAvatar from "@mui/material/Avatar";

const Avatar = ({ data, getSrc, alt, getAlt }) => {
    return <MUIAvatar alt={getAlt ? getAlt(data) : alt} src={getSrc ? getSrc(data) : null} />
}

export default Avatar;
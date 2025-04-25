import { ATFormImageSelectImageProps } from '@/lib/types/ui/ImageSelect.type';
import Button from '@mui/material/Button';

const Image = ({ id, name, src, onClick, width, height, selected }: ATFormImageSelectImageProps) => {
    const buttonStyle = {
        display: 'inline-block',
        textAlign: '-webkit-center',
        width: `${width + 18}px`,
        height: `${height + 18}px`,
        padding: '1px',
        textTransform: 'none',
        ...(!selected ? {} : {
            border: 'double 1px transparent',
            borderRadius: '20px',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #46BFAE, #2865B3)'
            // 'linear-gradient(#46BFAE, #2865B3) 30'
        })
    }

    return <Button sx={buttonStyle} onClick={onClick} variant={'text'} color={selected ? 'secondary' : 'primary'}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img alt={name || id} src={src} style={{ borderRadius: '10px', width: `${width}px`, height: `${height}px` }} />
        </div>
    </Button>
}

export default Image;
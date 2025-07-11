
export const fileFilter = ( req : Express.Request, file:Express.Multer.File, callback:Function ) => {
    
    if( !file ) return callback( new Error('File is empty'), false );

    const fileExtension :string = file.mimetype.split('/')[1];
    const validExtension:string[] = ['jpg', 'jpeg', 'png', 'svg', 'gif'];

    if( validExtension.includes(fileExtension) ) return callback( null, true );

    callback( null, false );
};